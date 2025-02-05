// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RouteRecord is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _recordIds;

    struct Route {
        uint256 id;
        address user;
        string origin;
        string destination;
        string distance;
        uint256 timestamp;
        bool verified;
    }

    mapping(uint256 => Route) public routes;
    mapping(address => uint256[]) public userRoutes;

    event RouteRecorded(
        uint256 indexed id,
        address indexed user,
        string origin,
        string destination,
        string distance,
        uint256 timestamp
    );

    event RouteVerified(uint256 indexed id, bool verified);

    constructor() Ownable() {}

    function recordRoute(
        string memory origin,
        string memory destination,
        string memory distance,
        uint256 timestamp
    ) public returns (uint256) {
        _recordIds.increment();
        uint256 newRecordId = _recordIds.current();

        Route memory newRoute = Route({
            id: newRecordId,
            user: msg.sender,
            origin: origin,
            destination: destination,
            distance: distance,
            timestamp: timestamp,
            verified: false
        });

        routes[newRecordId] = newRoute;
        userRoutes[msg.sender].push(newRecordId);

        emit RouteRecorded(
            newRecordId,
            msg.sender,
            origin,
            destination,
            distance,
            timestamp
        );

        return newRecordId;
    }

    function verifyRoute(uint256 routeId) public onlyOwner {
        require(routes[routeId].id != 0, "Route does not exist");
        routes[routeId].verified = true;
        emit RouteVerified(routeId, true);
    }

    function getUserRoutes(address user) public view returns (uint256[] memory) {
        return userRoutes[user];
    }

    function getRoute(uint256 routeId) public view returns (Route memory) {
        require(routes[routeId].id != 0, "Route does not exist");
        return routes[routeId];
    }
}
