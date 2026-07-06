function getReputation() {
    var result = server.GetUserData({
        PlayFabId: currentPlayerId,
        Keys: ["user_reputation"]
    });

    if (
        result.Data &&
        result.Data.user_reputation &&
        result.Data.user_reputation.Value
    ) {
        var reputation = JSON.parse(result.Data.user_reputation.Value);

        if (reputation.level === undefined || reputation.level === null) {
            reputation.level = 1;
        }

        if (reputation.points === undefined || reputation.points === null) {
            reputation.points = 0;
        }

        return reputation;
    }

    var defaultReputation = {
        level: 1,
        points: 0,
        updatedAt: new Date().toISOString()
    };

    server.UpdateUserData({
        PlayFabId: currentPlayerId,
        Data: {
            user_reputation: JSON.stringify(defaultReputation)
        }
    });

    return defaultReputation;
}

function saveReputation(reputation) {
    reputation.updatedAt = new Date().toISOString();

    server.UpdateUserData({
        PlayFabId: currentPlayerId,
        Data: {
            user_reputation: JSON.stringify(reputation)
        }
    });

    return reputation;
}

handlers.LoadReputation = function (args, context) {
    var reputation = getReputation();

    return {
        success: true,
        playFabId: currentPlayerId,
        reputation: reputation
    };
};

handlers.AddReputationPoints = function (args, context) {
    if (!args || args.points === undefined || args.points === null) {
        return {
            success: false,
            error: "points is required"
        };
    }

    var points = Number(args.points);

    if (isNaN(points) || points <= 0) {
        return {
            success: false,
            error: "points must be greater than 0"
        };
    }

    points = Math.floor(points);

    var reputation = getReputation();

    reputation.points = Number(reputation.points || 0);
    reputation.level = Number(reputation.level || 1);

    reputation.points += points;

    var calculatedLevel = Math.floor(reputation.points / 100) + 1;

    if (calculatedLevel > reputation.level) {
        reputation.level = calculatedLevel;
    }

    reputation = saveReputation(reputation);

    return {
        success: true,
        action: "ADD_REPUTATION_POINTS",
        pointsAdded: points,
        reputation: reputation
    };
};