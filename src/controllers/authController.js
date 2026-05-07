import { registerService, loginService } from "../services/authService.js";

export const registerUser = async (req, res) => {
  try {
    const userData = await registerService(req.body);
    res.status(201).json({
      message: "User registered successfully",
      user: userData,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await loginService(email, password);
    res.status(200).json({
      message: "Login successful",
      user: userData,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
