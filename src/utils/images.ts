/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import childhoodPhoto from '../assets/images/childhood_photo_1783076818148.jpg';
import recentPhoto from '../assets/images/recent_photo_1783076835324.jpg';
import cousinsGroupPhoto from '../assets/images/cousins_group_1783076849925.jpg';

// Centralized image references with support for easy user uploads in the public/ folder!
export const BIRTHDAY_IMAGES = {
  // Main journey illustration images
  childhood: {
    custom: '/images/childhood.jpeg',
    default: childhoodPhoto
  },
  recent: {
    custom: '/images/recent.jpeg',
    default: recentPhoto
  },
  cousinsGroup: {
    custom: '/images/cousins_group.jpeg',
    default: cousinsGroupPhoto
  },

  // Polaroid Gallery items with custom slot support
  polaroids: [
    {
      id: 'p1',
      custom: '/images/polaroid1.jpeg',
      default: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
      caption: 'Merisipothunna Greeshma, You are stronger than you give yourself credit for, and kinder than the world deserves.🌼',
      angle: '-6deg',
    },
    {
      id: 'p2',
      custom: '/images/polaroid2.jpeg',
      default: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop',
      caption: 'Murisipothunna Greeshma, You have a smile that quietly makes ordinary moments feel a little brighter. 🎂',
      angle: '4deg',
    },
    {
      id: 'p3',
      custom: '/images/polaroid3.jpg',
      default: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=800&auto=format&fit=crop',
      caption: 'Vangipothunna Greeshma, A beautiful heart will always outshine a beautiful face, and you have both kindness and character.✨',
      angle: '-4deg',
    },
    {
      id: 'p4',
      custom: '/images/polaroid4.jpg',
      default: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop',
      caption: 'Veligipothunna Greeshma, You carry positivity so naturally that people feel lighter just by being around you. 🌼❤️',
      angle: '6deg',
    },
    {
      id: 'p5',
      custom: '/images/polaroid5.jpg',
      default: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop',
      caption: 'Padhathigala Greeshma, Your kindness is the kind that people remember long after the conversation is over. 🌼',
      angle: '-2deg',
    }
  ],

  // Avatars & messages for the four lovely parents/elders
  parents: {
    father: {
      name: 'Father',
      customAvatar: '/images/avatar_father.jpeg',
      defaultAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop',
      message: "Dear Greeshma, Happy Birthday! Seeing you grow into such an amazing, responsible, and loving woman makes me extremely proud every single day. Always remember to stay happy, pursue your dreams with confidence, and know that I am always here supporting you. Have a wonderful, blessed year ahead! ❤️",
    },
    mother: {
      name: 'Mother',
      customAvatar: '/images/avatar_mother.jpeg',
      defaultAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop',
      message: "Happy Birthday! Your laughter is the true light of our home. Thank you for always being so caring, supportive, and taking care of everyone. May you receive all the love, health, and success in the world. Always keep smiling, my sweet daughter! 🌸",
    },
    pinni: {
      name: 'Pinni',
      customAvatar: '/images/avatar_pinni.jpeg',
      defaultAvatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=300&auto=format&fit=crop',
      message: "Happy Birthday Greeshma! Wishing you a gorgeous year filled with endless joy, beautiful achievements, and delightful surprises. You deserve the best of everything! 🌟✨",
    },
    chinna_pinni: {
      name: 'Chinna Pinni',
      customAvatar: '/images/avatar_chinna_pinni.jpeg',
      defaultAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=300&auto=format&fit=crop',
      message: "Happy Birthday Greeshma! Keep shining, keep smiling, and keep spreading your wonderful positive vibes everywhere. Have an amazing celebration today! 🎉🎂",
    }
  },

  // Avatars & messages for the five cousins
  cousins: {
    teju: {
      name: 'Teju',
      customAvatar: '/images/avatar_teju.jpeg',
      defaultAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop',
      message: "Happy Birthday, Akka! ❤️ Thank you for always being the one we can count on. Keep smiling, keep shining, and never stop being the amazing person you are. Wishing you a year full of happiness and unforgettable memories!",
    },
    neeraj: {
      name: 'Neeraj',
      customAvatar: '/images/avatar_neeraj.jpeg',
      defaultAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
      message: "Happy Birthday Greeshma Akka 🎉 Stay happy, stay crazy, and keep taking care of all of us... even though you never stop giving us advice! 😄 Hope this year brings you lots of success, laughter, and endless ice cream!",
    },
    chitti: {
      name: 'Chitti',
      customAvatar: '/images/avatar_chitti.jpeg',
      defaultAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop',
      message: "Happy Birthday to the sweetest Akka! 💖 Thank you for all the laughs, the memories, and for always being there. May your smile stay as bright as it is today. Have the most wonderful birthday ever!",
    },
    mohith: {
      name: 'Mohith',
      customAvatar: '/images/avatar_mohith.jpeg',
      defaultAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
      message: "Happy Birthday, Akka! 🎂 I hope you get a big cake, lots of chocolates, and many gifts! Don't forget to save some cake for me! Have the happiest birthday ever! 🥳🍫",
    },
    mokshitha: {
      name: 'Mokshitha',
      customAvatar: '/images/avatar_mokshitha.jpeg',
      defaultAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop',
      message: "Happyyy Buddayyy Akkkkaaa! 🎈 I love youuu! I want cake... balloons... chocolates... and I want to play with you all day! Yayy! 🥹🎂❤️",
    }
  }
};
