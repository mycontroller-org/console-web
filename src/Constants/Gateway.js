// Provider keeps supported providers list, this value will be used in backend
export const Provider = {
  ESPHome: "esphome",
  MySensorsV2: "mysensors_v2",
  PhilipsHue: "philips_hue",
  SystemMonitoring: "system_monitoring",
  Tasmota: "tasmota",
}

// Providers options list
export const ProviderOptions = [
  { value: Provider.ESPHome, label: "ESPHome", description: "esphome.io" },
  { value: Provider.MySensorsV2, label: "MySensors v2", description: "MySensors.org Version 2.x" },
  { value: Provider.PhilipsHue, label: "PhilipsHue", description: "developers.meethue.com" },
  {
    value: Provider.SystemMonitoring,
    label: "System Monitoring",
    description: "Capture system resources and reports",
  },
  { value: Provider.Tasmota, label: "Tasmota", description: "tasmota.github.io" },
]

// Protocol values
export const Protocol = {
  MQTT: "mqtt",
  Serial: "serial",
  Ethernet: "ethernet",
}

// Protocol options list
export const ProtocolOptions = [
  { value: Protocol.MQTT, label: "MQTT", description: "MQTT Protocol" },
  { value: Protocol.Serial, label: "Serial", description: "Serial Protocol" },
  { value: Protocol.Ethernet, label: "Ethernet", description: "Ethernet Protocol" },
]

export const filterProtocolOptions = (providerType) => {
  const protocols = []
  switch (providerType) {
    case Provider.MySensorsV2:
      protocols.push(Protocol.MQTT, Protocol.Serial, Protocol.Ethernet)
      break

    case Provider.Tasmota:
      protocols.push(Protocol.MQTT)
      break

    default:
      break
  }
  const protocolOptions = []
  ProtocolOptions.forEach((option) => {
    if (protocols.includes(option.value)) {
      protocolOptions.push(option)
    }
  })

  return protocolOptions
}

// Message logger values
export const MessageLogger = {
  None: "none",
  FileLogger: "file_logger",
}

// Message logger options list
export const MessageLoggerOptions = [
  { value: MessageLogger.None, label: "None", description: "Messages will not be logged" },
  { value: MessageLogger.FileLogger, label: "File Logger", description: "Messages will be logged in a file" },
]
