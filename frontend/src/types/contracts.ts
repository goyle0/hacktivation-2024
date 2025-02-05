export const MovementRecordABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "origin",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "destination",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "distance",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "recordRoute",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "routeId",
        "type": "uint256"
      }
    ],
    "name": "verifyRoute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "routeId",
        "type": "uint256"
      }
    ],
    "name": "getRoute",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "user",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "origin",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "destination",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "distance",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "verified",
            "type": "bool"
          }
        ],
        "internalType": "struct RouteRecord.Route",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export interface RouteRecord {
  id: number;
  user: string;
  origin: string;
  destination: string;
  distance: string;
  timestamp: number;
  verified: boolean;
}
