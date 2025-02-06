// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title RouteRecord
 * @dev ユーザーの移動ルートを記録し、検証するためのスマートコントラクト
 * OpenZeppelinのOwnableを継承して、管理者機能を実装しています
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RouteRecord is Ownable {
    using Counters for Counters.Counter;
    /// @dev ルートIDの連番を管理するカウンター
    Counters.Counter private _recordIds;

    /**
     * @dev ルート情報を格納する構造体
     * @param id ルートの一意のID
     * @param user ルートを記録したユーザーのアドレス
     * @param origin 出発地点
     * @param destination 目的地
     * @param distance 移動距離
     * @param timestamp 記録された時間のタイムスタンプ
     * @param verified ルートが検証されたかどうかのフラグ
     */
    struct Route {
        uint256 id;
        address user;
        string origin;
        string destination;
        string distance;
        uint256 timestamp;
        bool verified;
    }

    /// @dev ルートIDからルート情報へのマッピング
    mapping(uint256 => Route) public routes;
    /// @dev ユーザーアドレスからそのユーザーのルートID配列へのマッピング
    mapping(address => uint256[]) public userRoutes;

    /**
     * @dev 新しいルートが記録された時に発行されるイベント
     * @param id 記録されたルートのID
     * @param user ルートを記録したユーザーのアドレス
     * @param origin 出発地点
     * @param destination 目的地
     * @param distance 移動距離
     * @param timestamp 記録時のタイムスタンプ
     */
    event RouteRecorded(
        uint256 indexed id,
        address indexed user,
        string origin,
        string destination,
        string distance,
        uint256 timestamp
    );

    /**
     * @dev ルートが検証された時に発行されるイベント
     * @param id 検証されたルートのID
     * @param verified 検証状態
     */
    event RouteVerified(uint256 indexed id, bool verified);

    /**
     * @dev コントラクトのコンストラクタ
     * OpenZeppelinのOwnableコントラクトを初期化します
     */
    constructor() Ownable() {}

    /**
     * @dev 新しいルートを記録する関数
     * @param origin 出発地点
     * @param destination 目的地
     * @param distance 移動距離
     * @param timestamp 記録時のタイムスタンプ
     * @return uint256 新しく生成されたルートのID
     */
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

    /**
     * @dev ルートを検証する関数（コントラクト所有者のみ実行可能）
     * @param routeId 検証するルートのID
     */
    function verifyRoute(uint256 routeId) public onlyOwner {
        require(routes[routeId].id != 0, "Route does not exist");
        routes[routeId].verified = true;
        emit RouteVerified(routeId, true);
    }

    /**
     * @dev 特定のユーザーのすべてのルートIDを取得する関数
     * @param user ルートを取得したいユーザーのアドレス
     * @return uint256[] メモリ上のルートIDの配列
     */
    function getUserRoutes(address user) public view returns (uint256[] memory) {
        return userRoutes[user];
    }

    /**
     * @dev 特定のルート情報を取得する関数
     * @param routeId 取得したいルートのID
     * @return Route メモリ上のルート情報
     */
    function getRoute(uint256 routeId) public view returns (Route memory) {
        require(routes[routeId].id != 0, "Route does not exist");
        return routes[routeId];
    }
}
