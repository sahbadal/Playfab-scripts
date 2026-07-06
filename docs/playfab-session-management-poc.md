# PlayFab User Session Management POC

## Overview

This Proof of Concept (POC) demonstrates a basic user session management flow using PlayFab CloudScript and PlayFab UserData.

The goal of this POC is to validate the complete player startup flow after authentication and provide a modular structure for future game systems.

---

# Flow

```text
LoginWithCustomID
        │
        ▼
Session Created
(SessionTicket + PlayFabId)
        │
        ▼
GetSessionStatus
        │
        ▼
LoadPlayerBootstrap
        │
        ├── Profile
        ├── Currency
        ├── Missions
        └── Reputation
        │
        ▼
Game Ready
```

---

# Implemented Modules

## 1. Session Management

Implemented APIs

- LoginWithCustomID
- UpdateDisplayName
- GetSessionStatus
- LogoutSession

Responsibilities

- Authenticate player
- Validate active session
- Return current PlayFabId
- Return DisplayName
- Acknowledge logout request

---

## 2. Player Bootstrap

Implemented API

- LoadPlayerBootstrap

Responsibilities

- Load all required startup player data
- Return one unified response for game initialization

Returned Data

- Profile
- Currency
- Missions
- Reputation

---

## 3. Player Currency

Storage Key

```text
user_currency
```

JSON Structure

```json
{
    "coins": 150,
    "updatedAt": "..."
}
```

Implemented APIs

- LoadCurrency
- AddCoins
- SpendCoins

Validation

- Amount must be greater than zero
- Cannot spend more coins than available

---

## 4. Player Missions

Storage Key

```text
user_missions
```

JSON Structure

```json
{
    "lastMissionId": "mission_001",
    "missions": [
        {
            "missionId": "mission_001",
            "status": "completed",
            "progress": 100
        }
    ]
}
```

Implemented APIs

- LoadMissions
- UpdateMissionProgress
- CompleteMission

Validation

- MissionId required
- Progress must be between 0-100
- Completed mission cannot be updated

---

## 5. Player Reputation

Storage Key

```text
user_reputation
```

JSON Structure

```json
{
    "level": 2,
    "points": 120
}
```

Implemented APIs

- LoadReputation
- AddReputationPoints

Validation

- Points must be greater than zero
- Reputation level calculated from points

Current Rule

```text
Every 100 reputation points = +1 Reputation Level
```

---

# Player Bootstrap Response

```json
{
    "profile": {},
    "currency": {},
    "missions": {},
    "reputation": {}
}
```

The game requires only one API call after successful login to initialize the player.

---

# PlayFab UserData Structure

```text
user_profile

user_currency

user_missions

user_reputation
```

Each module stores its own JSON document independently.

This avoids rewriting unrelated player data whenever one module changes.

---

# Testing

Verified Using

- PlayFab CloudScript
- PlayFab Game Manager
- Postman

Verified Scenarios

- Login
- Session validation
- DisplayName update
- Player Bootstrap
- Currency load
- Currency add
- Currency spend
- Mission load
- Mission progress update
- Mission completion
- Reputation load
- Reputation update
- Bootstrap response validation

---

# Current Limitations

This is a Proof of Concept implementation.

The following production features are not included yet.

- Anti-cheat validation
- Reward service
- Economy integration
- Inventory system
- Server-side transactions
- Audit logs
- Telemetry
- Multi-device session handling
- Session expiration handling

---

# Next Steps

- Inventory Module
- Profile Progression
- Achievement System
- Photon Fusion Integration
- Reward Pipeline
- Economy Integration