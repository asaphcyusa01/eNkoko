import React from 'react';

interface InstructorProps {
  name: string;
  title: string;
  image: string;
  bio: string;
}

export default function CourseInstructor({ name, title, image, bio }: InstructorProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Your Instructor</h3>
      <div className="flex items-start gap-4">
        <img
          src={image}
          alt={name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-gray-700">{bio}</p>
        </div>
      </div>
    </div>
  );
}