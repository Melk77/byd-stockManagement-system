const prisma = require("../config/prismaClient");

const getAllHistory = async (req, res) => {
  try {
    const history = await prisma.saleHistory.findMany({
      orderBy: { soldDate: "desc" },
    });

    res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllHistory,
};
