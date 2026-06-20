import test from "node:test"
import assert from "node:assert/strict"
import { getCompatibilityReport, isCompatibleChoice } from "../lib/compatibility.js"

const cpu = { name: "Ryzen 7", socket: "AM5" }
const motherboard = { name: "B650 Board", socket: "AM5", memoryType: "DDR5", formFactor: "ATX" }
const ram = { name: "DDR5 Kit", memoryType: "DDR5" }
const gpu = { name: "RTX GPU", recommendedPsu: 750, lengthMm: 304 }
const psu = { name: "850W PSU", wattage: 850 }
const pcCase = {
  name: "ATX Case",
  supportedFormFactors: ["ATX", "MicroATX", "MiniITX"],
  maxGpuLengthMm: 360,
  maxCoolerHeightMm: 170,
  supportedRadiatorSizes: [240, 280, 360],
}
const cooler = { name: "Air Cooler", supportedSockets: ["AM5"], coolerHeightMm: 160 }

test("accepts a compatible complete build", () => {
  const report = getCompatibilityReport({ CPU: cpu, Motherboard: motherboard, RAM: ram, GPU: gpu, PSU: psu, Case: pcCase, Cooling: cooler })
  assert.equal(report.status, "compatible")
  assert.deepEqual(report.issues, [])
})

test("detects CPU and motherboard socket mismatch", () => {
  const report = getCompatibilityReport({ CPU: cpu, Motherboard: { ...motherboard, socket: "LGA1700" } })
  assert.equal(report.status, "incompatible")
  assert.ok(report.issues.some((issue) => issue.code === "CPU_SOCKET"))
})

test("detects motherboard and memory type mismatch", () => {
  const report = getCompatibilityReport({ Motherboard: motherboard, RAM: { ...ram, memoryType: "DDR4" } })
  assert.ok(report.issues.some((issue) => issue.code === "MEMORY_TYPE"))
})

test("detects insufficient power supply wattage", () => {
  const report = getCompatibilityReport({ GPU: gpu, PSU: { ...psu, wattage: 650 } })
  assert.ok(report.issues.some((issue) => issue.code === "PSU_WATTAGE"))
})

test("detects GPU and air cooler clearance problems", () => {
  const report = getCompatibilityReport({
    GPU: { ...gpu, lengthMm: 380 },
    Case: pcCase,
    Cooling: { ...cooler, coolerHeightMm: 180 },
  })
  assert.ok(report.issues.some((issue) => issue.code === "GPU_CLEARANCE"))
  assert.ok(report.issues.some((issue) => issue.code === "COOLER_CLEARANCE"))
})

test("detects unsupported radiator sizes", () => {
  const report = getCompatibilityReport({ Case: { ...pcCase, supportedRadiatorSizes: [240, 280] }, Cooling: { name: "360 AIO", radiatorSize: 360 } })
  assert.ok(report.issues.some((issue) => issue.code === "RADIATOR_CLEARANCE"))
})

test("marks a component choice as incompatible before selection", () => {
  const compatible = isCompatibleChoice({ CPU: cpu }, "Motherboard", { ...motherboard, socket: "LGA1700" })
  assert.equal(compatible, false)
})
