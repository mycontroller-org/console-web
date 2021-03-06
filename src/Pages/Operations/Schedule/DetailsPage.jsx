import React from "react"
import DetailRootPage from "../../../Components/BasePage/DetailsBase"
import TabDetails from "./TabDetails"
import UpdatePage from "./UpdatePage"

class GatewayDetailPage extends React.Component {
  render() {
    const { id } = this.props.match.params
    const tabs = [
      {
        name: "Details",
        content: <TabDetails resourceId={id} history={this.props.history} />,
      },
      {
        name: "Edit",
        content: <UpdatePage match={this.props.match} history={this.props.history} />,
      },
    ]
    return <DetailRootPage pageHeader="Schedule Details" tabs={tabs} />
  }
}

export default GatewayDetailPage
