import React, { FC } from 'react';

interface AvatarProps {
  name: string;
  image?: string;
}

const Avatar: FC<AvatarProps> = ({ name, image }) => {
  return image ? (
    <img
      className="w-8 h-8 rounded-full"
      src={image}
      alt={`Avatar of ${name}`}
    />
  ) : (
    <div className="block w-8 h-8">
      <div className="flex w-8 h-8 rounded-full justify-center items-center bg-gray-400 text-white">
        {name.charAt(0).toUpperCase()}
      </div>
    </div>
  );
};

export default Avatar;
