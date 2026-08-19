const prisma = require("../config/prismaClient");

const getAllSpareParts = async (req, res) => {
  try {
    const spareParts = await prisma.sparePart.findMany({
      include: {
        carModel: {
          select: { carModel: true, year: true },
        },
      },
      orderBy: { name: "asc" },
    });

    res.status(200).json({
      success: true,
      data: spareParts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const [carModelCount, parts] = await Promise.all([
      prisma.carModel.count(),
      prisma.sparePart.findMany({ select: { quantity: true } }),
    ]);

    const totalParts = parts.length;
    const totalUnits = parts.reduce((sum, p) => sum + p.quantity, 0);
    const outOfStock = parts.filter((p) => p.quantity === 0).length;
    const lowStock = parts.filter(
      (p) => p.quantity > 0 && p.quantity <= 5,
    ).length;

    res.status(200).json({
      success: true,
      data: {
        carModelCount,
        totalParts,
        totalUnits,
        outOfStock,
        lowStock,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSparePartsByCarModel = async (req, res) => {
  try {
    const { carModelId } = req.params;

    let id = carModelId;
    let year;

    if (carModelId.includes("-")) {
      const parts = carModelId.split("-");
      year = parts.pop();
      id = parts.join("-");
    }

    const carModel = await prisma.carModel.findFirst({
      where: year ? { id, year } : { id },
      include: {
        spareParts: {
          orderBy: { name: "asc" },
        },
      },
    });

    if (!carModel) {
      return res.status(404).json({
        success: false,
        message: "Car model not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: carModel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/spare-parts
// body: { carModelId, name, quantity, minPrice, maxPrice }
const createSparePart = async (req, res) => {
  try {
    let { carModelId, name, quantity, minPrice, maxPrice } = req.body;

    if (!carModelId || !name) {
      return res.status(400).json({
        success: false,
        message: "carModelId and name are required.",
      });
    }

    // Support the composite "id-year" form the frontend can send.
    let id = carModelId;
    if (carModelId.includes("-")) {
      const parts = carModelId.split("-");
      parts.pop();
      id = parts.join("-");
    }

    const carModel = await prisma.carModel.findUnique({ where: { id } });

    if (!carModel) {
      return res.status(404).json({
        success: false,
        message: "Car model not found.",
      });
    }

    const newPart = await prisma.sparePart.create({
      data: {
        name,
        quantity: Number(quantity) || 0,
        minPrice:
          minPrice !== undefined && minPrice !== "" ? Number(minPrice) : null,
        maxPrice:
          maxPrice !== undefined && maxPrice !== "" ? Number(maxPrice) : null,
        carModelId: id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Spare part added successfully.",
      data: newPart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addSparePartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: "quantity must be a positive number.",
      });
    }

    const part = await prisma.sparePart.findUnique({ where: { id } });

    if (!part) {
      return res.status(404).json({
        success: false,
        message: "Spare part not found.",
      });
    }

    const updated = await prisma.sparePart.update({
      where: { id },
      data: { quantity: part.quantity + Number(quantity) },
    });

    res.status(200).json({
      success: true,
      message: "Quantity updated.",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const sellSparePartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const sellQty = Number(quantity);

    if (!sellQty || sellQty <= 0) {
      return res.status(400).json({
        success: false,
        message: "quantity must be a positive number.",
      });
    }

    const part = await prisma.sparePart.findUnique({
      where: { id },
      include: { carModel: true },
    });

    if (!part) {
      return res.status(404).json({
        success: false,
        message: "Spare part not found.",
      });
    }

    if (sellQty > part.quantity) {
      return res.status(400).json({
        success: false,
        message: "Cannot sell more than the available quantity.",
      });
    }

    const [updated] = await prisma.$transaction([
      prisma.sparePart.update({
        where: { id },
        data: { quantity: part.quantity - sellQty },
      }),
      prisma.saleHistory.create({
        data: {
          sparePartName: part.name,
          carModel: part.carModel.carModel,
          year: part.carModel.year,
          quantity: sellQty,
          sparePartId: part.id,
        },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: "Sale recorded.",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSparePart = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, minPrice, maxPrice } = req.body;

    const part = await prisma.sparePart.findUnique({ where: { id } });

    if (!part) {
      return res.status(404).json({
        success: false,
        message: "Spare part not found.",
      });
    }

    const updated = await prisma.sparePart.update({
      where: { id },
      data: {
        ...(name !== undefined && name !== "" && { name }),
        ...(minPrice !== undefined && {
          minPrice: minPrice === "" ? null : Number(minPrice),
        }),
        ...(maxPrice !== undefined && {
          maxPrice: maxPrice === "" ? null : Number(maxPrice),
        }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Spare part updated.",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/spare-parts/:id
const deleteSparePart = async (req, res) => {
  try {
    const { id } = req.params;

    const part = await prisma.sparePart.findUnique({ where: { id } });

    if (!part) {
      return res.status(404).json({
        success: false,
        message: "Spare part not found.",
      });
    }

    await prisma.sparePart.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Spare part deleted.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllSpareParts,
  getDashboardSummary,
  getSparePartsByCarModel,
  createSparePart,
  updateSparePart,
  addSparePartQuantity,
  sellSparePartQuantity,
  deleteSparePart,
};
