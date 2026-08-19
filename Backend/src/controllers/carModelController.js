const prisma = require("../config/prismaClient");

// Get all car models
const getAllCarModels = async (req, res) => {
  try {
    const carModels = await prisma.carModel.findMany();

    res.status(200).json({
      success: true,
      data: carModels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add a new car model
const createCarModel = async (req, res) => {
  console.log("Request body:", req.body);

  try {
    const { carModel, year } = req.body;

    if (!carModel) {
      return res.status(400).json({
        success: false,
        message: "Car model is required.",
      });
    }

    const existingModel = await prisma.carModel.findFirst({
      where: {
        carModel,
        year,
      },
    });

    if (existingModel) {
      return res.status(409).json({
        success: false,
        message: "Car model already exists.",
      });
    }

    const newCarModel = await prisma.carModel.create({
      data: {
        carModel,
        year,
      },
    });

    res.status(201).json({
      success: true,
      message: "Car model added successfully.",
      data: newCarModel,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Edit an existing car model (rename / change year)
const updateCarModel = async (req, res) => {
  try {
    const { id } = req.params;
    const { carModel, year } = req.body;

    const existing = await prisma.carModel.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Car model not found.",
      });
    }

    const updated = await prisma.carModel.update({
      where: { id },
      data: {
        ...(carModel !== undefined && { carModel }),
        ...(year !== undefined && { year }),
      },
    });

    res.status(200).json({
      success: true,
      message: "Car model updated successfully.",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a car model — cascades to its spare parts (see schema.prisma
// SparePart.carModel onDelete: Cascade), so this is ADMIN-only at the route.
const deleteCarModel = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.carModel.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Car model not found.",
      });
    }

    await prisma.carModel.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Car model and its spare parts were deleted.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllCarModels,
  createCarModel,
  updateCarModel,
  deleteCarModel,
};
