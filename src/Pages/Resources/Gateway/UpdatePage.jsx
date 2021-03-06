import objectPath from "object-path"
import React from "react"
import Editor from "../../../Components/Editor/Editor"
import { DataType, FieldType } from "../../../Constants/Form"
import PageContent from "../../../Components/PageContent/PageContent"
import PageTitle from "../../../Components/PageTitle/PageTitle"
import { api } from "../../../Service/Api"
import { redirect as r, routeMap as rMap } from "../../../Service/Routes"
import {
  Provider,
  ProviderOptions,
  Protocol,
  MessageLogger,
  MessageLoggerOptions,
  filterProtocolOptions,
} from "../../../Constants/Gateway"
import { getESPHomeItems } from "./EspHome/Update"
import { getSystemMonitoringItems } from "./SystemMonitoring/Update"
import { getPhilipsHueItems } from "./PhilipsHue/Update"

class UpdatePage extends React.Component {
  render() {
    const { id } = this.props.match.params

    const isNewEntry = id === undefined || id === ""

    const editor = (
      <Editor
        key="editor"
        resourceId={id}
        language="yaml"
        apiGetRecord={api.gateway.get}
        apiSaveRecord={api.gateway.update}
        minimapEnabled
        onSaveRedirectFunc={() => {
          r(this.props.history, rMap.resources.gateway.list)
        }}
        onCancelFunc={() => {
          r(this.props.history, rMap.resources.gateway.list)
        }}
        getFormItems={(rootObject) => getFormItems(rootObject, id)}
      />
    )

    if (isNewEntry) {
      return (
        <>
          <PageTitle key="page-title" title="Add a Gateway" />
          <PageContent hasNoPaddingTop>{editor} </PageContent>
        </>
      )
    }
    return editor
  }
}

export default UpdatePage

// support functions

const getFormItems = (rootObject, id) => {
  objectPath.set(rootObject, "reconnectDelay", "30s", true)
  objectPath.set(rootObject, "queueFailedMessages", false, true)
  objectPath.set(rootObject, "labels", { location: "server" }, true)
  const items = [
    {
      label: "ID",
      fieldId: "id",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: true,
      isDisabled: id ? true : false,
      helperText: "",
      helperTextInvalid: "Invalid id. chars: min=2 and max=100",
      validated: "default",
      validator: { isLength: { min: 2, max: 100 }, isID: {}, isNotEmpty: {} },
    },
    {
      label: "Description",
      fieldId: "description",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      isRequired: false,
    },
    {
      label: "Enabled",
      fieldId: "enabled",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "Reconnect Delay",
      fieldId: "reconnectDelay",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
    {
      label: "Queue Failed Messages",
      fieldId: "queueFailedMessages",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: false,
    },
    {
      label: "Labels",
      fieldId: "!labels",
      fieldType: FieldType.Divider,
    },
    {
      label: "",
      fieldId: "labels",
      fieldType: FieldType.Labels,
      dataType: DataType.Object,
      value: {},
      validator: { isLabel: {} },
    },
    {
      label: "Provider",
      fieldId: "!provider.type",
      fieldType: FieldType.Divider,
    },
    {
      label: "Type",
      fieldId: "provider.type",
      isRequired: true,
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.String,
      options: ProviderOptions,
      validated: "error",
      value: "",
    },
  ]

  const providerType = objectPath.get(rootObject, "provider.type", "").toLowerCase()
  switch (providerType) {
    case Provider.MySensorsV2:
      const mySensorsItems = getMySensorsItems(rootObject)
      items.push(...mySensorsItems)
      break

    case Provider.Tasmota: // set tasmota defaults
      objectPath.set(rootObject, "provider.protocol.type", Protocol.MQTT, true)
      break

    default:
      break
  }

  // if there is provider selected, common details
  if (
    providerType !== "" &&
    providerType !== Provider.SystemMonitoring &&
    providerType !== Provider.PhilipsHue &&
    providerType !== Provider.ESPHome
  ) {
    objectPath.set(rootObject, "provider.protocol.transmitPreDelay", "10ms", true)

    items.push(
      {
        label: "Protocol",
        fieldId: "!provider.protocol.type",
        fieldType: FieldType.Divider,
      },
      {
        label: "Type",
        fieldId: "provider.protocol.type",
        isRequired: true,
        fieldType: FieldType.SelectTypeAhead,
        dataType: DataType.String,
        options: filterProtocolOptions(providerType),
        value: "",
      },
      {
        label: "Transmit Pre Delay",
        fieldId: "provider.protocol.transmitPreDelay",
        fieldType: FieldType.Text,
        dataType: DataType.String,
        value: "",
      }
    )

    // protocol fields
    const protocolType = objectPath.get(rootObject, "provider.protocol.type", "").toLowerCase()
    switch (protocolType) {
      case Protocol.MQTT:
        const protocolMqttItems = getProtocolMqttItems(rootObject)
        items.push(...protocolMqttItems)
        break

      case Protocol.Serial:
        const protocolSerialItems = getProtocolSerialItems(rootObject)
        items.push(...protocolSerialItems)
        break

      case Protocol.Ethernet:
        const protocolEthernetItems = getProtocolEthernetItems(rootObject)
        items.push(...protocolEthernetItems)
        break

      default:
        break
    }
  }

  if (
    providerType !== "" &&
    providerType !== Provider.SystemMonitoring &&
    providerType !== Provider.PhilipsHue &&
    providerType !== Provider.ESPHome
  ) {
    // message logger
    objectPath.set(rootObject, "messageLogger.type", MessageLogger.None, true)
    items.push(
      {
        label: "Message Logger",
        fieldId: "!messageLogger.type",
        fieldType: FieldType.Divider,
      },
      {
        label: "Type",
        fieldId: "messageLogger.type",
        isRequired: true,
        fieldType: FieldType.SelectTypeAhead,
        dataType: DataType.String,
        options: MessageLoggerOptions,
        direction: "up",
      }
    )

    // message logger properties
    const msgLoggerType = objectPath.get(rootObject, "messageLogger.type", "").toLowerCase()
    switch (msgLoggerType) {
      case MessageLogger.FileLogger:
        const fileLoggerItems = getLoggerFileItems(rootObject)
        items.push(...fileLoggerItems)
        break

      default:
        break
    }
  }

  if (providerType === Provider.SystemMonitoring) {
    const systemMonitoringItems = getSystemMonitoringItems(rootObject)
    items.push(...systemMonitoringItems)
  } else if (providerType === Provider.PhilipsHue) {
    const philipsHueItems = getPhilipsHueItems(rootObject)
    items.push(...philipsHueItems)
  } else if (providerType === Provider.ESPHome) {
    const espHomeItems = getESPHomeItems(rootObject)
    items.push(...espHomeItems)
  }

  return items
}

// get provider items
// get MySensor Provider items
const getMySensorsItems = (rootObject) => {
  objectPath.set(rootObject, "provider.retryCount", 3, true)
  objectPath.set(rootObject, "provider.timeout", "500ms", true)
  const items = [
    {
      label: "Internal Message Ack",
      fieldId: "provider.enableInternalMessageAck",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: "",
    },
    {
      label: "Stream Message Ack",
      fieldId: "provider.enableStreamMessageAck",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: "",
    },
    {
      label: "Retry Count",
      fieldId: "provider.retryCount",
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      validator: { isInt: { min: 0 } },
      helperTextInvalid: "Invalid Retry count. int, min=0",
    },
    {
      label: "Timeout",
      fieldId: "provider.timeout",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
  ]
  return items
}

// get protocol items
// get protocol mqtt items
const getProtocolMqttItems = (rootObject) => {
  objectPath.set(rootObject, "provider.protocol.qos", 0, true)
  const items = [
    {
      label: "Broker",
      fieldId: "provider.protocol.broker",
      isRequired: true,
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      validator: {
        isURL: {
          protocols: ["ws", "wss", "unix", "mqtt", "tcp", "ssl", "tls", "mqtts", "mqtt+ssl", "tcps"],
        },
      },
      helperTextInvalid: "Invalid Broker URL.",
    },
    {
      label: "Insecure Skip Verify",
      fieldId: "provider.protocol.insecureSkipVerify",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: "",
    },
    {
      label: "Username",
      fieldId: "provider.protocol.username",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
    {
      label: "Password",
      fieldId: "provider.protocol.password",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
    {
      label: "Subscribe",
      fieldId: "provider.protocol.subscribe",
      isRequired: true,
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      helperTextInvalid: "Invalid Topic",
      validator: { isNotEmpty: {} },
    },
    {
      label: "Publish",
      fieldId: "provider.protocol.publish",
      isRequired: true,
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      helperTextInvalid: "Invalid Topic",
      validator: { isNotEmpty: {} },
    },
    {
      label: "QoS",
      fieldId: "provider.protocol.qos",
      isRequired: true,
      fieldType: FieldType.SelectTypeAhead,
      dataType: DataType.Integer,
      value: "",
      options: [
        { value: "0", label: "At most once (0)" },
        { value: "1", label: "At least once (1)" },
        { value: "2", label: "Exactly once (2)" },
      ],
    },
  ]

  return items
}

// get protocol serial items
const getProtocolSerialItems = (rootObject) => {
  objectPath.set(rootObject, "provider.protocol.baudrate", 115200, true)
  const items = [
    {
      label: "Port Name",
      fieldId: "provider.protocol.portname",
      isRequired: true,
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
    {
      label: "Baud Rate",
      fieldId: "provider.protocol.baudrate",
      isRequired: true,
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      validator: { isBaudRate: {} },
      helperTextInvalid: "Invalid Baud rate.",
    },
  ]
  return items
}

// get protocol ethernet items
const getProtocolEthernetItems = (_rootObject) => {
  const items = [
    {
      label: "Server",
      fieldId: "provider.protocol.server",
      isRequired: true,
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
      validator: {
        isURL: {
          protocols: ["tcp", "tcps", "ssl", "tls"],
        },
      },
      helperTextInvalid: "Invalid Server URL.",
    },
    {
      label: "Insecure Skip Verify",
      fieldId: "provider.protocol.insecureSkipVerify",
      fieldType: FieldType.Switch,
      dataType: DataType.Boolean,
      value: "",
    },
  ]
  return items
}

// logger items
// get file logger items
const getLoggerFileItems = (rootObject) => {
  objectPath.set(rootObject, "messageLogger.flushInterval", "1s", true)
  objectPath.set(rootObject, "messageLogger.logRotateInterval", "12h", true)
  objectPath.set(rootObject, "messageLogger.maxSize", "2MiB", true)
  objectPath.set(rootObject, "messageLogger.maxAge", "72h", true)
  objectPath.set(rootObject, "messageLogger.maxBackup", 7, true)
  const items = [
    {
      label: "Flush Interval",
      fieldId: "messageLogger.flushInterval",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
    {
      label: "Log Rotate Interval",
      fieldId: "messageLogger.logRotateInterval",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
    {
      label: "Maximum Size",
      fieldId: "messageLogger.maxSize",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
    {
      label: "Maximum Age",
      fieldId: "messageLogger.maxAge",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      value: "",
    },
    {
      label: "Maximum Backup",
      fieldId: "messageLogger.maxBackup",
      fieldType: FieldType.Text,
      dataType: DataType.Integer,
      value: "",
      validator: { isInt: { min: 0 } },
      helperTextInvalid: "Invalid Maximum Backup. int, min=0",
    },
  ]
  return items
}
