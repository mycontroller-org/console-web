import React from "react"
import { api } from "../../../../Service/Api"
import SimpleSlider from "../../../Form/Slider/Simple"

const SliderControl = ({
  id,
  widgetId,
  quickId,
  payload = "",
  selector = "",
  min = 0,
  max = 100,
  step = 1,
  minWidth = 70,
  sendPayloadWrapper = () => {},
}) => {
  return (
    <div style={{ minWidth: `${minWidth}px`, marginBottom: "-6px" }}>
      <SimpleSlider
        id={`${widgetId}_${id}`}
        min={min}
        max={max}
        step={step}
        value={payload}
        onChange={(newValue) => sendPayloadWrapper(() => onChange(quickId, selector, newValue))}
      />
    </div>
  )
}

const onChange = (quickId, selector, payload) => {
  api.action.send({ resource: quickId, payload: payload, selector: selector })
}

export default SliderControl