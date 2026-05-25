import Setting from '../models/Setting.js';

// @desc    Get setting by key
// @route   GET /api/settings/:key
// @access  Public
export const getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await Setting.findOne({ key });
    if (setting) {
      res.json(setting.value);
    } else {
      res.status(404).json({ message: 'Setting not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update or create a setting by key
// @route   PUT /api/settings/:key
// @access  Private/Admin
export const updateSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({ message: 'Please provide a value' });
    }

    let setting = await Setting.findOne({ key });

    if (setting) {
      setting.value = value;
      await setting.save();
    } else {
      setting = new Setting({
        key,
        value,
      });
      await setting.save();
    }

    res.json({ message: 'Setting updated successfully', value: setting.value });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
