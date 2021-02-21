import React from "react"
import TabDetailsBase from "../../../Components/BasePage/TabDetailsBase"
import { KeyValueMap, Labels } from "../../../Components/DataDisplay/Label"
import { api } from "../../../Service/Api"
import { DisplayTrue } from "../../../Components/DataDisplay/Miscellaneous"

const tabDetails = ({ resourceId, history }) => {
  return (
    <TabDetailsBase
      resourceId={resourceId}
      history={history}
      apiGetRecord={api.task.get}
      getDetailsFunc={getDetailsFuncImpl}
    />
  )
}

export default tabDetails

// helper functions

const getDetailsFuncImpl = (data) => {
  const fieldsList1 = []
  const fieldsList2 = []

  fieldsList1.push({ key: "ID", value: data.id })
  fieldsList1.push({ key: "Description", value: data.description })
  fieldsList1.push({ key: "Enabled", value: <DisplayTrue data={data} field="enabled" /> })
  fieldsList1.push({ key: "Labels", value: <Labels data={data.labels} /> })
  fieldsList1.push({ key: "Ignore Duplicate", value: <DisplayTrue data={data} field="ignoreDuplicate" /> })
  fieldsList1.push({ key: "Auto Disable", value: <DisplayTrue data={data} field="autoDisable" /> })
  fieldsList1.push({ key: "Trigger On Event", value: <DisplayTrue data={data} field="triggerOnEvent" /> })
  fieldsList1.push({ key: "Notify", value: data.notify })
  fieldsList2.push({ key: "Variables", value: <KeyValueMap data={data.variables} /> })
  fieldsList2.push({ key: "State", value: <KeyValueMap data={data.state} /> })

  return {
    "list-1": fieldsList1,
    "list-2": fieldsList2,
  }
}
