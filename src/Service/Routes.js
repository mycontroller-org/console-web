import { TachometerAltIcon } from "@patternfly/react-icons"
import React from "react"
import Dashboard from "../Pages/Dashboard/Dashboard"
import GatewayUpdatePage from "../Pages/Resources/Gateway/UpdatePage"
// import DummyPage from "../Pages/DummyPage/DummyPage"
import { default as GatewayDetailPage } from "../Pages/Resources/Gateway/DetailsPage"
import GatewayListPage from "../Pages/Resources/Gateway/ListPage"
import NodeUpdatePage from "../Pages/Resources/Node/UpdatePage"
import NodeDetailPage from "../Pages/Resources/Node/DetailsPage"
import NodeListPage from "../Pages/Resources/Node/ListPage"
import SensorDetailPage from "../Pages/Resources/Sensor/DetailsPage"
import SensorListPage from "../Pages/Resources/Sensor/ListPage"
import SensorUpdatePage from "../Pages/Resources/Sensor/UpdatePage"
import SensorFieldDetailPage from "../Pages/Resources/SensorField/DetailsPage"
import SensorFieldListPage from "../Pages/Resources/SensorField/ListPage"
import SensorFieldUpdatePage from "../Pages/Resources/SensorField/UpdatePage"
import ProfilePage from "../Pages/Settings/Profile/Profile"
import ForwardPayloadListPage from "../Pages/Actions/ForwardPayload/ListPage"
import ForwardPayloadUpdatePage from "../Pages/Actions/ForwardPayload/UpdatePage"
import ForwardPayloadDetailPage from "../Pages/Actions/ForwardPayload/DetailsPage"
// import dummyPage from "../Pages/DummyPage/DummyPage"
//import TopologyPage from "../Pages/Topology/Topology"

const routeMap = {
  home: "/",
  dashboard: "/dashboard",
  resources: {
    gateway: {
      list: "/resources/gateway",
      detail: "/resources/gateway/list/:id",
      update: "/resources/gateway/update/:id",
      add: "/resources/gateway/add",
    },
    node: {
      list: "/resources/node",
      detail: "/resources/node/list/:id",
      update: "/resources/node/update/:id",
      add: "/resources/node/add",
    },
    sensor: {
      list: "/resources/sensor",
      detail: "/resources/sensor/list/:id",
      update: "/resources/sensor/update/:id",
      add: "/resources/sensor/add",
    },
    sensorField: {
      list: "/resources/field",
      detail: "/resources/field/list/:id",
      update: "/resources/field/update/:id",
      add: "/resources/field/add",
    },
  },
  settings: {
    profile: "/settings/profile",
  },
  actions: {
    forwardPayload: {
      list: "/actions/forwardpayload",
      detail: "/actions/forwardpayload/list/:id",
      update: "/actions/forwardpayload/update/:id",
      add: "/actions/forwardpayload/add",
    },
  },
}

const routes = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <TachometerAltIcon />,
    children: [
      {
        id: "dashboardMain",
        title: "Dashboard",
        to: "/dashboard/main",
        component: Dashboard,
        icon: <TachometerAltIcon />,
      },
      // {
      //   id: "dashboardTopology",
      //   title: "Topology",
      //   to: "/dashboard/topology",
      //   component: TopologyPage,
      // },
    ],
  },
  {
    id: "resources",
    title: "Resources",
    children: [
      {
        id: "gateway",
        title: "Gateways",
        to: routeMap.resources.gateway.list,
        component: GatewayListPage,
      },
      {
        id: "node",
        title: "Nodes",
        to: routeMap.resources.node.list,
        component: NodeListPage,
      },
      {
        id: "sensor",
        title: "Sensors",
        to: routeMap.resources.sensor.list,
        component: SensorListPage,
      },
      {
        id: "field",
        title: "Sensor Fields",
        to: routeMap.resources.sensorField.list,
        component: SensorFieldListPage,
      },
    ],
  },
  {
    id: "actions",
    title: "Actions",
    children: [
      {
        id: "forwardpayload",
        title: "Forward Payload",
        to: routeMap.actions.forwardPayload.list,
        component: ForwardPayloadListPage,
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    children: [
      {
        id: "profile",
        title: "Profile",
        to: routeMap.settings.profile,
        component: ProfilePage,
      },
    ],
  },
  // {
  //   id: "dummyPage",
  //   title: "Dummy Page",
  //   to: "/dummypage",
  //   component: dummyPage,
  // },
]

const hiddenRoutes = [
  {
    to: routeMap.home,
    component: Dashboard,
  },
  {
    to: routeMap.resources.gateway.detail,
    component: GatewayDetailPage,
  },
  {
    to: routeMap.resources.node.detail,
    component: NodeDetailPage,
  },
  {
    to: routeMap.resources.sensor.detail,
    component: SensorDetailPage,
  },
  {
    to: routeMap.resources.sensorField.detail,
    component: SensorFieldDetailPage,
  },
  {
    to: routeMap.resources.gateway.add,
    component: GatewayUpdatePage,
  },
  {
    to: routeMap.resources.node.add,
    component: NodeUpdatePage,
  },
  {
    to: routeMap.resources.sensor.add,
    component: SensorUpdatePage,
  },
  {
    to: routeMap.resources.sensorField.add,
    component: SensorFieldUpdatePage,
  },
  {
    to: routeMap.actions.forwardPayload.add,
    component: ForwardPayloadUpdatePage,
  },
  {
    to: routeMap.actions.forwardPayload.detail,
    component: ForwardPayloadDetailPage,
  },
]

const redirect = (history, to = routeMap.home, urlParams = {}) => {
  //console.log(history, to, urlParams)
  //const to = t(routeMap, name).safeString
  if (to) {
    let finalPath = to
    Object.keys(urlParams).forEach((key) => {
      finalPath = finalPath.replace(":" + key, urlParams[key])
    })
    history.push(finalPath)
  }
}

export { routes, hiddenRoutes, routeMap, redirect }
