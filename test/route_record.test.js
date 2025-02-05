const RouteRecord = artifacts.require("RouteRecord");
const { expect } = require("chai");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");

contract("RouteRecord", (accounts) => {
  const [owner, user1] = accounts;
  let routeRecord;

  beforeEach(async () => {
    routeRecord = await RouteRecord.new({ from: owner });
  });

  describe("記録機能", () => {
    const testRoute = {
      origin: "東京駅",
      destination: "渋谷駅",
      distance: "4.5km",
      timestamp: Math.floor(Date.now() / 1000),
    };

    it("新しい経路を記録できること", async () => {
      const result = await routeRecord.recordRoute(
        testRoute.origin,
        testRoute.destination,
        testRoute.distance,
        testRoute.timestamp,
        { from: user1 }
      );

      expectEvent(result, "RouteRecorded", {
        id: new BN(1),
        user: user1,
        origin: testRoute.origin,
        destination: testRoute.destination,
        distance: testRoute.distance,
        timestamp: new BN(testRoute.timestamp),
      });

      const route = await routeRecord.getRoute(1);
      expect(route.user).to.equal(user1);
      expect(route.origin).to.equal(testRoute.origin);
      expect(route.destination).to.equal(testRoute.destination);
      expect(route.distance).to.equal(testRoute.distance);
      expect(route.timestamp.toString()).to.equal(testRoute.timestamp.toString());
      expect(route.verified).to.equal(false);
    });
  });

  describe("検証機能", () => {
    beforeEach(async () => {
      await routeRecord.recordRoute(
        "東京駅",
        "渋谷駅",
        "4.5km",
        Math.floor(Date.now() / 1000),
        { from: user1 }
      );
    });

    it("オーナーが経路を検証できること", async () => {
      const result = await routeRecord.verifyRoute(1, { from: owner });
      expectEvent(result, "RouteVerified", {
        id: new BN(1),
        verified: true,
      });

      const route = await routeRecord.getRoute(1);
      expect(route.verified).to.equal(true);
    });

    it("オーナー以外は経路を検証できないこと", async () => {
      await expectRevert(
        routeRecord.verifyRoute(1, { from: user1 }),
        "Ownable: caller is not the owner"
      );
    });
  });

  describe("ユーザー経路取得", () => {
    beforeEach(async () => {
      await routeRecord.recordRoute(
        "東京駅",
        "渋谷駅",
        "4.5km",
        Math.floor(Date.now() / 1000),
        { from: user1 }
      );
    });

    it("ユーザーの経路一覧を取得できること", async () => {
      const routes = await routeRecord.getUserRoutes(user1);
      expect(routes.length).to.equal(1);
      expect(routes[0].toString()).to.equal("1");
    });
  });
});
