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
      apiGetRecord={api.handler.get}
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
  fieldsList1.push({ key: "Type", value: data.type })
  fieldsList1.push({ key: "State", value: <KeyValueMap data={data.state} /> })
  fieldsList2.push({ key: "Spec", value: <KeyValueMap data={data.spec} /> })

  return {
    "list-1": fieldsList1,
    "list-2": fieldsList2,
  }
}
