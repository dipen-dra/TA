const mongoose = require("mongoose");

const passwordResetTokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

// TTL Index to automatically delete documents after they expire (or some time after creation)
// Actually we can just use the expires property on a Date field.
// Let's set a TTL on created_at if we had one, or rely on checking expiresAt manually.
// For simplicity, let's just rely on manual expiration check or add a TTL index.

passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("PasswordResetToken", passwordResetTokenSchema);
