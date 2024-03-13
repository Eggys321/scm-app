const USER = require('../models/userModel')

// follow friend

const followFriend = async(req,res)=>{
    try {
        const { friendId } = req.params;
        const {userId} = req.user;
        const user = await USER.findById(userId);
        const friend = await USER.findById(friendId);
  
        if (!user || !friend) {
          return res.status(404).json({ message: 'User or friend not found' });
        }
        if (userId === friendId) {
            return res.json({message:"You cannot follow yourself"});
          }
  
        if (!user.friends.includes(friendId)) {
          user.friends.push(friendId);
          await user.save();
        }
  
        res.json({ message: 'Friend followed successfully', user });
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.log(error.message);
      }

}

// unfollow
const unfollowFriend =async(req,res)=>{
    try {
        const { friendId } = req.params;
        const {userId} = req.user;

        const user = await USER.findById(userId);
  
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        user.friends = user.friends.filter((friend) => friend.toString() !== friendId);
        await user.save();
  
        res.json({ message: 'Friend unfollowed successfully', user });
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.log(error.message);
      }
}

module.exports = {
    followFriend,
    unfollowFriend
}