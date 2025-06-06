export const stdStorageSafeAbi = [
  {
    "type": "event",
    "name": "SlotFound",
    "inputs": [
      {
        "name": "who",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "fsig",
        "type": "bytes4",
        "indexed": false,
        "internalType": "bytes4"
      },
      {
        "name": "keysHash",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "slot",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "WARNING_UninitedSlot",
    "inputs": [
      {
        "name": "who",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "slot",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const;