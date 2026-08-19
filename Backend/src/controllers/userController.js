const bcrypt = require("bcrypt");
const prisma = require("../config/prismaClient");

// GET /api/users
// ADMIN-only. Never returns password hashes.
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, username, email, and password are required.",
      });
    }

    if (role && !["ADMIN", "STAFF"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "role must be ADMIN or STAFF.",
      });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "A user with this username already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        role: role || "STAFF",
      },
    });

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        isActive: newUser.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;

    if (role && !["ADMIN", "STAFF"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "role must be ADMIN or STAFF.",
      });
    }

    if (id === req.user.id && isActive === false) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account.",
      });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(role !== undefined && { role }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    res.status(200).json({
      success: true,
      message: "User updated.",
      data: {
        id: updated.id,
        name: updated.name,
        username: updated.username,
        email: updated.email,
        role: updated.role,
        isActive: updated.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// PATCH /api/users/me
// Any logged-in user can change their own username and/or password.
// Changing the password (or the username) requires the current
// password, so a stolen/left-open session can't silently take over
// the account.
const updateMyAccount = async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Your current password is required to make changes.",
      });
    }

    if (!username && !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Provide a new username and/or a new password.",
      });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const data = {};

    if (username && username !== user.username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUsername) {
        return res.status(409).json({
          success: false,
          message: "That username is already taken.",
        });
      }

      data.username = username;
    }

    if (newPassword) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          success: false,
          message:
            "New password must be at least 8 characters and include an uppercase letter, lowercase letter, number, and special character.",
        });
      }

      data.password = await bcrypt.hash(newPassword, 10);
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
    });

    res.status(200).json({
      success: true,
      message: "Your account has been updated.",
      data: {
        id: updated.id,
        name: updated.name,
        username: updated.username,
        email: updated.email,
        role: updated.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  updateMyAccount,
};
