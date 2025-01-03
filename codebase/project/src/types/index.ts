export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  duration: string;
}

export interface ChickBreed {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  availability: boolean;
}