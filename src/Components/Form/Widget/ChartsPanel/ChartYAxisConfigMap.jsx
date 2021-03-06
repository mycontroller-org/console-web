import { Button, Modal, ModalVariant } from "@patternfly/react-core"
import { EditIcon } from "@patternfly/react-icons"
import objectPath from "object-path"
import React from "react"
import Editor from "../../../Editor/Editor"
import ErrorBoundary from "../../../ErrorBoundary/ErrorBoundary"
import { DataType, FieldType } from "../../../../Constants/Form"
import PropTypes from "prop-types"
import { ColorsSetBig } from "../../../../Constants/Widgets/Color"

class ChartYAxisConfigMap extends React.Component {
  state = {
    isOpen: false,
  }

  onClose = () => {
    this.setState({ isOpen: false })
  }

  onOpen = () => {
    this.setState({ isOpen: true })
  }

  render() {
    const { isOpen } = this.state
    const { value, id, name, onChange } = this.props
    return (
      <>
        <Button key={"edit-btn-" + id} variant="control" onClick={this.onOpen}>
          <EditIcon />
        </Button>
        <Modal
          key={"edit-field-data" + id}
          title={"Update Y Axis: " + name}
          variant={ModalVariant.medium}
          position="top"
          isOpen={isOpen}
          onClose={this.onClose}
          onEscapePress={this.onClose}
        >
          <ErrorBoundary>
            <Editor
              key={"editor" + id}
              disableEditor={false}
              language="yaml"
              rootObject={value}
              onSaveFunc={(rootObject) => {
                onChange(rootObject)
                this.onClose()
              }}
              onChangeFunc={() => {}}
              minimapEnabled={false}
              onCancelFunc={this.onClose}
              isWidthLimited={false}
              getFormItems={getItems}
              saveButtonText="Update"
            />
          </ErrorBoundary>
        </Modal>
      </>
    )
  }
}

ChartYAxisConfigMap.propTypes = {
  value: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
}

export default ChartYAxisConfigMap

const getItems = (rootObject) => {
  // set default values
  objectPath.set(rootObject, "offsetY", 0, true)
  objectPath.set(rootObject, "color", "#4f5255", true)
  objectPath.set(rootObject, "roundDecimal", 0, true)
  objectPath.set(rootObject, "unit", "", true)

  const items = [
    {
      label: "Offset Y (%)",
      fieldId: "offsetY",
      fieldType: FieldType.SliderSimple,
      dataType: DataType.Integer,
      value: "",
      min: 0,
      max: 100,
      step: 1,
    },
    {
      label: "Color",
      fieldId: "color",
      fieldType: FieldType.ColorBox,
      dataType: DataType.String,
      colors: ColorsSetBig,
      isRequired: true,
      value: "",
      validator: { isNotEmpty: {} },
    },
    {
      label: "Round Decimal",
      fieldId: "roundDecimal",
      fieldType: FieldType.SliderSimple,
      dataType: DataType.Integer,
      value: "",
      min: 0,
      max: 10,
      step: 1,
    },
    {
      label: "Unit",
      fieldId: "unit",
      fieldType: FieldType.Text,
      dataType: DataType.String,
      isRequired: false,
      value: "",
    },
  ]

  return items
}
