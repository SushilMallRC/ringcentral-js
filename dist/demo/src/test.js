"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sdk_1 = require("@ringcentral/sdk");
var subscriptions_1 = require("@ringcentral/subscriptions");
var sdk = new sdk_1.SDK({
    clientId: 'foo',
    clientSecret: 'foo',
    server: sdk_1.SDK.server.production,
});
var subscriptions = new subscriptions_1.Subscriptions({ sdk: sdk });
var sub = subscriptions.createSubscription();
//# sourceMappingURL=test.js.map