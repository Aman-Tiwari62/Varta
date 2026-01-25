import User from "../models/user.model.js";

export const searchPeople = async (req,res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Query is required"
      });
    }

    const users = await User.find({
      username: { $regex: q, $options: "i" } // case-insensitive search
    })
      .select("username avatar") // don’t send sensitive data
      .limit(10);

    res.status(200).json({
      success: true,
      users
    });

  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const getUser = async (req, res) => {
  console.log('getuser route hit!')
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .select("name username avatar"); // add what you want to show

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
