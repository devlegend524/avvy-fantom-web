const records = {
  standard: [
    { name: 'X-Chain Address', type: 1 },
    { name: 'P-Chain Address', type: 2 },
    { name: 'C-Chain / EVM Address', type: 3 },
    { name: 'Avatar', type: 4 },
    { name: 'DNS CNAME Record', type: 5 },
    { name: 'DNS A Record', type: 6 },
  ],

  getStandard: (type) => {
    for (let i = 0; i < records.standard.length; i += 1) {
      if (records.standard[i].type === type) return records.standard[i]
    }
  }
}

export default records
