const Notification = require('../models/Notification');

/**
 * Send notification to a single recipient
 */
const sendNotification = async ({ recipientId, senderId = null, title, message, type = 'announcement', link = '' }) => {
  try {
    const notification = await Notification.create({
      recipientId,
      senderId,
      title,
      message,
      type,
      link
    });
    return notification;
  } catch (error) {
    console.error('[NotificationService Error]', error.message);
  }
};

/**
 * Send notification in bulk to a list of recipients (e.g. all course students)
 */
const sendBulkNotifications = async (recipientIds, { senderId = null, title, message, type = 'announcement', link = '' }) => {
  try {
    if (!recipientIds || recipientIds.length === 0) return [];
    
    const docs = recipientIds.map((recipientId) => ({
      recipientId,
      senderId,
      title,
      message,
      type,
      link
    }));

    return await Notification.insertMany(docs);
  } catch (error) {
    console.error('[Bulk NotificationService Error]', error.message);
  }
};

module.exports = {
  sendNotification,
  sendBulkNotifications
};
