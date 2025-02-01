export const MovementRecordABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_origin",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_destination",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_distance",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_duration",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_timestamp",
        "type": "string"
      }
    ],
    "name": "submitRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export interface MovementRecord {
  origin: string;
  destination: string;
  distance: string;
  duration: string;
  timestamp: string;
}
