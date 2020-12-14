import React from "react"
import YAML from "js-yaml"
import { api } from "../../../Service/Api"
import DetailBase from "../../../Components/BasePage/DetailBase"

import { KeyValueMap, Labels } from "../../../Components/Label/Label"
import { GridItem, Button } from "@patternfly/react-core"
import Table from "../../../Components/Table/Table"
import { METRIC_TYPES } from "../../../config/globalConfig"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import { LastSeen } from "../../../Components/Time/Time"
import CodeEditor from "../../../Components/CodeEditor/CodeEditor"

class Detail extends DetailBase {
  componentDidMount() {
    this.loadDetail()
  }

  render() {
    return super.render()
  }
}

const renderFunc = (data, wrapFieldFunc, wrapCardFunc) => {
  const fields = []
  fields.push(wrapFieldFunc("ID", data.id))
  fields.push(wrapFieldFunc("Gateway ID", data.gatewayId))
  fields.push(wrapFieldFunc("Node ID", data.nodeId))
  fields.push(wrapFieldFunc("Sensor ID", data.sensorId))
  fields.push(wrapFieldFunc("Name", data.name))
  fields.push(wrapFieldFunc("Last Seen", data.lastSeen))

  const others = []
  others.push(wrapFieldFunc("Labels", <Labels data={data.labels} />))
  others.push(wrapFieldFunc("Others", <KeyValueMap data={data.others} />))

  const yamlData = YAML.safeDump(data)
  const content = []

  content.push(wrapCardFunc("Overview", fields))
  content.push(wrapCardFunc("Labels and Others", others))
  content.push(wrapCardFunc("YAML", <CodeEditor data={yamlData} />))

  return content
}

// Properties definition
const tableColumnsField = [
  { title: "Field ID", fieldKey: "fieldId", sortable: true },
  { title: "Name", fieldKey: "name", sortable: true },
  { title: "Metric Type", fieldKey: "metricType", sortable: true },
  { title: "Unit", fieldKey: "unit", sortable: true },
  { title: "Value", fieldKey: "payload.value", sortable: true },
  { title: "Previous Value", fieldKey: "previousPayload.value", sortable: true },
  { title: "Last Seen", fieldKey: "lastSeen", sortable: true },
]

const tableRowsField = (rawData, _index, history) => {
  return {
    cells: [
      {
        title: (
          <Button
            variant="link"
            isInline
            onClick={(e) => {
              r(history, rMap.resources.sensorField.detail, { id: rawData.id })
            }}
          >
            {rawData.fieldId}
          </Button>
        ),
      },
      rawData.name,
      METRIC_TYPES[rawData.metricType],
      rawData.unit,
      String(rawData.payload.value),
      String(rawData.previousPayload.value),
      { title: <LastSeen date={rawData.lastSeen} /> },
    ],
    rid: rawData.id,
  }
}

const updateSensorFieldDataFunc = (self, data) => {
  const others = []
  const filters = { gatewayId: data.gatewayId, nodeId: data.nodeId, sensorId: data.sensorId }

  others.push(
    <GridItem key="fields_table" sm={12}>
      <Table
        title="Sensor Fields"
        apiGetRecords={api.sensorField.list}
        tableColumns={tableColumnsField}
        toRowFunc={tableRowsField}
        history={self.props.history}
        filters={filters}
      />
    </GridItem>
  )
  self.setState({ others: others })
}

// supply required properties
Detail.defaultProps = {
  resourceName: "Sensor Details",
  apiGetRecord: api.sensor.get,
  renderFunc: renderFunc,
  redirectUpdatePage: "",
  updateOtherDataFunc: updateSensorFieldDataFunc,
}

export default Detail
