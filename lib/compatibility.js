export function getCompatibilityReport(selection) {
  const issues = []
  const cpu = selection.CPU
  const motherboard = selection.Motherboard
  const ram = selection.RAM
  const gpu = selection.GPU
  const psu = selection.PSU
  const pcCase = selection.Case
  const cooling = selection.Cooling

  if (cpu?.socket && motherboard?.socket && cpu.socket !== motherboard.socket) {
    issues.push({
      severity: "error",
      code: "CPU_SOCKET",
      message: `${cpu.name} uses ${cpu.socket}, but ${motherboard.name} uses ${motherboard.socket}.`,
    })
  }

  if (ram?.memoryType && motherboard?.memoryType && ram.memoryType !== motherboard.memoryType) {
    issues.push({
      severity: "error",
      code: "MEMORY_TYPE",
      message: `${ram.name} is ${ram.memoryType}, but the motherboard requires ${motherboard.memoryType}.`,
    })
  }

  if (
    motherboard?.formFactor &&
    pcCase?.supportedFormFactors?.length > 0 &&
    !pcCase.supportedFormFactors.includes(motherboard.formFactor)
  ) {
    issues.push({
      severity: "error",
      code: "MOTHERBOARD_CASE",
      message: `${pcCase.name} does not support the ${motherboard.formFactor} motherboard form factor.`,
    })
  }

  if (gpu?.recommendedPsu && psu?.wattage && psu.wattage < gpu.recommendedPsu) {
    issues.push({
      severity: "error",
      code: "PSU_WATTAGE",
      message: `${gpu.name} recommends at least ${gpu.recommendedPsu}W, but the selected PSU provides ${psu.wattage}W.`,
    })
  }

  if (gpu?.lengthMm && pcCase?.maxGpuLengthMm && gpu.lengthMm > pcCase.maxGpuLengthMm) {
    issues.push({
      severity: "error",
      code: "GPU_CLEARANCE",
      message: `${gpu.name} is ${gpu.lengthMm}mm long, exceeding the case limit of ${pcCase.maxGpuLengthMm}mm.`,
    })
  }

  if (
    cooling?.supportedSockets?.length > 0 &&
    cpu?.socket &&
    !cooling.supportedSockets.includes(cpu.socket)
  ) {
    issues.push({
      severity: "error",
      code: "COOLER_SOCKET",
      message: `${cooling.name} does not list support for the ${cpu.socket} socket.`,
    })
  }

  if (
    cooling?.radiatorSize &&
    pcCase?.supportedRadiatorSizes?.length > 0 &&
    !pcCase.supportedRadiatorSizes.includes(cooling.radiatorSize)
  ) {
    issues.push({
      severity: "error",
      code: "RADIATOR_CLEARANCE",
      message: `${pcCase.name} does not support a ${cooling.radiatorSize}mm radiator.`,
    })
  }

  if (
    cooling?.coolerHeightMm &&
    pcCase?.maxCoolerHeightMm &&
    cooling.coolerHeightMm > pcCase.maxCoolerHeightMm
  ) {
    issues.push({
      severity: "error",
      code: "COOLER_CLEARANCE",
      message: `${cooling.name} is ${cooling.coolerHeightMm}mm tall, exceeding the case limit of ${pcCase.maxCoolerHeightMm}mm.`,
    })
  }

  if (gpu?.recommendedPsu && !psu) {
    issues.push({
      severity: "warning",
      code: "PSU_MISSING",
      message: `${gpu.name} recommends a ${gpu.recommendedPsu}W or greater power supply.`,
    })
  }

  return {
    status: issues.some((issue) => issue.severity === "error")
      ? "incompatible"
      : issues.some((issue) => issue.severity === "warning")
        ? "warning"
        : "compatible",
    issues,
  }
}

export function isCompatibleChoice(selection, category, product) {
  const report = getCompatibilityReport({ ...selection, [category]: product })
  return !report.issues.some((issue) => issue.severity === "error")
}
