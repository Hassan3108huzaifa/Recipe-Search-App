'use client';

import React, { FormEvent, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchIcon, User, Facebook, Instagram, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';
import LoadingSpinner from './Spinner';

interface Recipe {
  uri: string;
  label: string;
  image: string;
  url: string;
  calories: number;
  ingredients: { text: string }[];
  source: string;
}

export default function RecipeCard() {
  const [query, setQuery] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const randomFoodKeywords = ["pasta", "pizza", "salad", "burger", "dessert", "rice", "fish", "soup", "sandwich"];

  const getRandomFoodKeyword = () => {
    return randomFoodKeywords[Math.floor(Math.random() * randomFoodKeywords.length)];
  };

  const fetchRecipes = useCallback(async (searchQuery: string, pageNum: number) => {
    const randomQuery = searchQuery || getRandomFoodKeyword();
    const url = `https://api.edamam.com/search?q=${randomQuery}&app_id=${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.NEXT_PUBLIC_EDAMAM_APP_KEY}&from=${(pageNum - 1) * 10}&to=${pageNum * 10}`;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      setRecipes(prevRecipes => [...prevRecipes, ...data.hits.map((hit: { recipe: Recipe }) => hit.recipe)]);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Failed to fetch recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes(query, page);
  }, [page, query, fetchRecipes]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
      setPage(prevPage => prevPage + 1);
    }
  }, [loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setRecipes([]);
    setPage(1);
    fetchRecipes(query, 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <form onSubmit={handleSearch} className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="https://w7.pngwing.com/pngs/426/730/png-transparent-logo-yellow-font-recipe-logo-art-yellow.png"
            alt="Edamam Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="text-2xl font-bold text-green-600 hidden sm:block">EDAMAM</span>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            type="text"
            placeholder="Search Recipes.."
            className="w-48 sm:w-64"
          />
          <Button variant="default" type="submit">
            <SearchIcon className="w-5 h-5" />
          </Button>
        </div>
        <Link href='https://www.linkedin.com/in/hassan-rj-148220295/' target='_blank'>
          <User className="w-6 h-6 text-gray-600" />
        </Link>
      </form>

      <main className="flex-grow container mx-auto px-4 py-8">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recipes && recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div key={recipe.uri} className="relative bg-white rounded-lg shadow-md overflow-hidden">
                <Image
                  src={recipe.image}
                  alt={recipe.label}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover object-center"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{recipe.label}</h3>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{recipe.calories.toFixed(2)} CALORIES</span>
                    <span>{recipe.ingredients.length} INGREDIENTS</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">{recipe.source}</div>
                </div>
                <Link href={recipe.url} className="absolute inset-0 z-10" prefetch={false}>
                  <span className="sr-only">View recipe</span>
                </Link>
              </div>
            ))
          ) : (
            <p>Loading Recipes...</p>
          )}
        </div>

        {loading && <LoadingSpinner />}
      </main>

      <footer className="bg-white py-4 px-6 flex flex-col sm:flex-row justify-between items-center shadow-md sticky bottom-0 z-50">
        <div className="flex space-x-4 mb-4 sm:mb-0">
          <a
            href="https://www.facebook.com/profile.php?id=100067756576220"
            className="text-gray-600 hover:text-gray-800"
            target='_blank'
            onClick={(e) => e.stopPropagation()}
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/Hassan3108huzaifa"
            className="text-gray-600 hover:text-gray-800"
            target='_blank'
            onClick={(e) => e.stopPropagation()}
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.instagram.com/mr.hassanbhai/"
            className="text-gray-600 hover:text-gray-800"
            target='_blank'
            onClick={(e) => e.stopPropagation()}
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/hassan-rj-148220295/"
            className="text-gray-600 hover:text-gray-800"
            target='_blank'
            onClick={(e) => e.stopPropagation()}
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </footer>
    </div>
  );
}