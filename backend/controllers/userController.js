import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import CV from '../models/CV.js';
import ATSAnalysis from '../models/ATSAnalysis.js';
import JobMatch from '../models/JobMatch.js';
import AIUsage from '../models/AIUsage.js';
import SupportTicket from '../models/SupportTicket.js';

const publicUser = (u) => ({
  id: u._id.toString(),
  name: u.name,
  email: u.email,
  avatar: u.avatar || '',
  role: u.role || 'user',
  preferences: u.preferences || {},
});

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE
|--------------------------------------------------------------------------
*/
export async function updateProfile(req, res) {
  try {
    const { name, email } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !email.includes('@')
    ) {
      return res.status(400).json({
        message: 'Valid name and email are required',
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const conflict = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: req.user._id },
    });

    if (conflict) {
      return res.status(409).json({
        message: 'Email is already in use',
      });
    }

    const user =
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            name: name.trim(),
            email: normalizedEmail,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.json({
      user: publicUser(user),
    });
  } catch (error) {
    console.error(
      'updateProfile error:',
      error
    );

    return res.status(500).json({
      message: 'Failed to update profile',
    });
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE PREFERENCES
|--------------------------------------------------------------------------
*/
export async function updatePreferences(
  req,
  res
) {
  try {
    const {
      theme,
      defaultTemplate,
      language,
    } = req.body;

    const validTheme =
      ['light', 'dark', 'system'].includes(
        theme
      )
        ? theme
        : 'light';

    const user =
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            preferences: {
              theme: validTheme,
              defaultTemplate:
                defaultTemplate ||
                'minimal',
              language:
                language || 'English',
            },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.json({
      user: publicUser(user),
    });
  } catch (error) {
    console.error(
      'updatePreferences error:',
      error
    );

    return res.status(500).json({
      message: 'Failed to update preferences',
    });
  }
}

/*
|--------------------------------------------------------------------------
| CHANGE PASSWORD
|--------------------------------------------------------------------------
*/
export async function changePassword(
  req,
  res
) {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        message:
          'Current password and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          'New password must be at least 6 characters',
      });
    }

    const user =
      await User.findById(
        req.user._id
      ).select('+password');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    if (
      !user.password ||
      !(await bcrypt.compare(
        currentPassword,
        user.password
      ))
    ) {
      return res.status(401).json({
        message:
          'Current password is incorrect',
      });
    }

    user.password =
      await bcrypt.hash(
        newPassword,
        12
      );

    await user.save();

    return res.json({
      message:
        'Password changed successfully',
    });
  } catch (error) {
    console.error(
      'changePassword error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to change password',
    });
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE PHOTO
|--------------------------------------------------------------------------
*/
export async function updateAvatar(
  req,
  res
) {
  try {
    const { avatar } = req.body;

    if (
      typeof avatar !== 'string' ||
      !avatar.startsWith('data:image/')
    ) {
      return res.status(400).json({
        message:
          'Valid profile image is required',
      });
    }

    /*
     * Protect MongoDB from extremely large
     * Base64 images.
     */
    if (avatar.length > 2_500_000) {
      return res.status(413).json({
        message:
          'Profile image is too large',
      });
    }

    const user =
      await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            avatar,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.json({
      message:
        'Profile photo updated successfully',
      user: publicUser(user),
    });
  } catch (error) {
    console.error(
      'updateAvatar error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to update profile photo',
    });
  }
}

/*
|--------------------------------------------------------------------------
| DELETE ACCOUNT
|--------------------------------------------------------------------------
*/
export async function deleteAccount(
  req,
  res
) {
  try {
    await CV.deleteMany({ user: req.user._id });
    await ATSAnalysis.deleteMany({ user: req.user._id });
    await JobMatch.deleteMany({ user: req.user._id });
    await AIUsage.deleteMany({ user: req.user._id });
    await SupportTicket.deleteMany({ user: req.user._id });

    await User.findByIdAndDelete(
      req.user._id
    );

    return res.json({
      message:
        'Account deleted successfully',
    });
  } catch (error) {
    console.error(
      'deleteAccount error:',
      error
    );

    return res.status(500).json({
      message:
        'Failed to delete account',
    });
  }
}