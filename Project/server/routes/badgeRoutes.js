
const express = require('express');
const router = express.Router();

const { authenticate, checkRole } = require('../middleware/authMiddleware');
const {
  getMyBadges,
  awardCourseBadge
} = require('../controllers/badgeController');
router.use(authenticate, checkRole('student'));


router.get('/', getMyBadges);


router.post('/award', awardCourseBadge);

module.exports = router;
