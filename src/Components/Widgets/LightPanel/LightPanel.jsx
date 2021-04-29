import React from "react"
import { api } from "../../../Service/Api"
import "rc-slider/assets/index.css"
import "./LightPanel.scss"
import { Grid, GridItem, Stack, Switch, Tooltip } from "@patternfly/react-core"
import ColorBox from "../../Color/ColorBox/ColorBox"
import objectPath from "object-path"
import { ColorsSetBig } from "../../../Constants/Widgets/Color"
import Loading from "../../Loading/Loading"
import HueSlider from "../../Color/HueSlider/HueSlider"
import { LightType, RGBComponentType } from "../../../Constants/Widgets/LightPanel"
import { AdjustIcon, ImageIcon, PaletteIcon, PowerOffIcon, TemperatureLowIcon } from "@patternfly/react-icons"
import { getValue } from "../../../Util/Util"
import SimpleSlider from "../../Form/Slider/Simple"
import { loadData, unloadData } from "../../../store/entities/websocket"
import { connect } from "react-redux"

const wsKey = "dashboard_light_panel"

class LightPanel extends React.Component {
  state = {
    loading: true,
    quickIdNameMap: {},
    nameQuickIdMap: {},
  }

  getWsKey = () => {
    return `${wsKey}_${this.props.widgetId}`
  }

  updateComponents = () => {
    const { fieldIds } = this.props.config
    const fieldIdKeys = Object.keys(fieldIds)
    const quickIdNameMap = {}
    const nameQuickIdMap = {}
    const quickIds = []

    fieldIdKeys.forEach((fieldType) => {
      const quickId = fieldIds[fieldType]
      if (quickId !== "") {
        quickIds.push(quickId)
        quickIdNameMap[quickId] = fieldType
        nameQuickIdMap[fieldType] = quickId
      }
    })

    api.quickId
      .getResources({ id: quickIds })
      .then((res) => {
        const resourcesRaw = res.data
        // add resources into redux store
        this.props.loadData({ key: this.getWsKey(), resources: resourcesRaw })

        this.setState({ loading: false, quickIdNameMap: quickIdNameMap, nameQuickIdMap: nameQuickIdMap })
      })
      .catch((_e) => {
        console.log("error", _e)
        this.setState({ loading: false, quickIdNameMap: quickIdNameMap, nameQuickIdMap: nameQuickIdMap })
      })
  }

  componentWillUnmount() {
    this.props.unloadData({ key: this.getWsKey() })
  }

  componentDidMount() {
    this.updateComponents()
  }

  onChange = (nameQuickIdMap, fieldName, newValue) => {
    const quickId = objectPath.get(nameQuickIdMap, fieldName, undefined)
    if (quickId) {
      api.action.send({ resource: quickId, payload: newValue })
    }
  }

  render() {
    const { loading, quickIdNameMap, nameQuickIdMap } = this.state
    const { lightType, rgbComponent } = this.props.config

    if (loading) {
      return <Loading />
    }

    // get resources from store
    const resourcesRaw = getValue(this.props.wsData, this.getWsKey(), {})

    const values = {}
    const resources = {}
    const quickIds = Object.keys(resourcesRaw)

    quickIds.forEach((quickId) => {
      const field = resourcesRaw[quickId]
      let value = objectPath.get(field, "current.value", "")

      const fieldName = quickIdNameMap[quickId]
      switch (fieldName) {
        case "dimmer":
        case "colorTemperature":
          values[fieldName] = Number(value)
          break

        case "hue":
          values[fieldName] = Number(value)
          break

        case "saturation":
          values[fieldName] = Number(value)
          break

        case "rgb":
          if (!value.startsWith("#")) {
            value = "#" + value
          }
          if (value.length > 7) {
            value = value.substring(0, 7)
          }
          values[fieldName] = value
          break

        default:
          values[fieldName] = value
      }

      resources[fieldName] = {
        id: field.id,
        label: field.name,
        value: value,
        quickId: quickId,
      }
    })

    const {
      power = false,
      dimmer = 0,
      colorTemperature = 350,
      rgb = "black",
      hue = 230,
      saturation = 0,
    } = values

    const fieldItems = []

    // add power switch
    fieldItems.push(
      <WrapItem
        key={"power-switch"}
        Icon={PowerOffIcon}
        iconTooltip="Power"
        field={
          <Switch
            id={`rgb-panel-power-${getValue(resources, "power.id", "id")}`}
            aria-label={`rgb-panel-power-${getValue(resources, "power.id", "id")}`}
            onChange={(newState) => this.onChange(nameQuickIdMap, "power", newState)}
            isChecked={power}
          />
        }
      />
    )

    // add dimmer
    fieldItems.push(
      <WrapItem
        key={"dimmer"}
        Icon={AdjustIcon}
        iconTooltip="Brightness"
        field={
          <SimpleSlider
            className="slider-brightness"
            id={"dimmer"}
            onChange={(newValue) => {
              this.onChange(nameQuickIdMap, "dimmer", Math.round(newValue))
            }}
            value={dimmer}
          />
        }
      />
    )

    // add cw, ww color temperature
    if (lightType === LightType.CWWW || lightType === LightType.RGBCWWW || lightType === LightType.RGBCW) {
      fieldItems.push(
        <WrapItem
          key="color-temp"
          Icon={TemperatureLowIcon}
          iconTooltip="Color Temperature"
          field={
            <SimpleSlider
              className="slider-color-temperature"
              id={"colorTemperature"}
              min={153}
              max={500}
              onChange={(newValue) => {
                this.onChange(nameQuickIdMap, "colorTemperature", Math.round(newValue))
              }}
              value={colorTemperature}
            />
          }
        />
      )
    }

    // add RGB color selector
    if (lightType === LightType.RGB || lightType === LightType.RGBCW || lightType === LightType.RGBCWWW) {
      if (rgbComponent === RGBComponentType.ColorPickerQuick) {
        fieldItems.push(
          <WrapItem
            key="color"
            Icon={PaletteIcon}
            iconTooltip="RGB Color"
            field={
              <ColorBox
                onChange={(newColor) => this.onChange(nameQuickIdMap, "rgb", newColor)}
                colors={ColorsSetBig}
                color={rgb}
              />
            }
          />
        )
      } else if (rgbComponent === RGBComponentType.HueSlider) {
        fieldItems.push(
          <WrapItem
            key="color"
            Icon={PaletteIcon}
            iconTooltip="HUE Color"
            field={
              <HueSlider
                onChange={(newHue) => {
                  this.onChange(nameQuickIdMap, "hue", Math.round(newHue))
                }}
                hue={hue}
              />
            }
          />
        )
      }

      // add saturation slider
      fieldItems.push(
        <WrapItem
          key="saturation"
          Icon={ImageIcon}
          iconTooltip="Saturation"
          field={
            <SimpleSlider
              className="slider-saturation"
              id={"saturation"}
              onChange={(newSaturation) => {
                this.onChange(nameQuickIdMap, "saturation", Math.round(newSaturation))
              }}
              value={saturation}
            />
          }
        />
      )
    }

    return (
      <div className="mc-rgb-light-panel">
        <Stack hasGutter className="component">
          {fieldItems}
        </Stack>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  wsData: state.entities.websocket.data,
})

const mapDispatchToProps = (dispatch) => ({
  loadData: (data) => dispatch(loadData(data)),
  unloadData: (data) => dispatch(unloadData(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(LightPanel)

// helper functions

const WrapItem = ({ Icon, iconTooltip, field }) => {
  return (
    <Grid>
      <GridItem span={1}>
        <Tooltip key="tooltip" content={iconTooltip} position="auto">
          <Icon size="md" />
        </Tooltip>
      </GridItem>
      <GridItem span={11} className="field">
        {field}
      </GridItem>
    </Grid>
  )
}
