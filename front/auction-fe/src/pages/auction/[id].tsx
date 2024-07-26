// src/pages/auction/[id].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { PlusIcon, ArrowLeftIcon, TrashIcon } from '@heroicons/react/20/solid';
import { fetchAuction, updateAuction, deleteAuction, placeBid } from '@/api';
import { Auction } from '@/types';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import Link from 'next/link';
import nookies from 'nookies';

const AuctionPage = () => {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bid, setBid] = useState<number | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const router = useRouter();
  const { id } = router.query;
  const [userId, setUserId] = useState(nookies.get(null).user_id);

  useEffect(() => {
    const loadAuction = async () => {
      const cookies = nookies.get();
      const token = cookies.token;

      if (!token) {
        router.push('/login');
        return;
      }

      if (id) {
        try {
          const fetchedAuction = await fetchAuction(Number(id));
          setAuction(fetchedAuction.data);
          setEditTitle(fetchedAuction.data.title);
          setEditDescription(fetchedAuction.data.description);
          setEditEndTime(fetchedAuction.data.endTime);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch auction.');
        } finally {
          setLoading(false);
        }
      }
    };

    loadAuction();
  }, [id]);

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof bid === 'number' && auction) {
      try {
        await placeBid(Number(auction.id), bid, Number(userId));
        alert('Bid placed successfully!');
        router.push('/dashboard');
        setIsModalOpen(false);
      } catch (error) {
        alert('Failed to place bid.');
      }
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (auction) {
      try {
        await updateAuction(Number(auction.id), {
          title: editTitle,
          description: editDescription,
          endTime: editEndTime,
        });
        alert('Auction updated successfully!');
      } catch (error) {
        alert('Failed to update auction.');
      }
    }
  };

  const handleDelete = async () => {
    if (auction) {
      try {
        await deleteAuction(Number(auction.id));
        alert('Auction deleted successfully!');
        router.push('/');
      } catch (error) {
        alert('Failed to delete auction.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!auction) return <div>Auction not found</div>;

  return (
    <div className="p-6">
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {auction.title}
          </h2>
          <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              {auction.description}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              Ends at: {new Date(auction.endTime).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="mt-5 flex lg:ml-4 lg:mt-0">
          <Link href="/" passHref>
            <p className="inline-flex items-center rounded-md bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 cursor-pointer">
              <ArrowLeftIcon aria-hidden="true" className="-ml-0.5 mr-1.5 h-5 w-5" />
              Back
            </p>
          </Link>
          <span className="sm:ml-3">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <TrashIcon aria-hidden="true" className="-ml-0.5 mr-1.5 h-5 w-5" />
              Delete
            </button>
          </span>
          <span className="sm:ml-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 h-5 w-5" />
              Add Bid
            </button>
          </span>
        </div>
      </div>

      <form onSubmit={handleEditSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <input
            type="datetime-local"
            id="endTime"
            value={editEndTime}
            onChange={(e) => setEditEndTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Update Auction
          </button>
        </div>
      </form>

      {/* Bid Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Place Your Bid
                    </DialogTitle>
                    <div className="mt-2">
                      <form onSubmit={handleBidSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="bid" className="block text-sm font-medium text-gray-700">
                            Enter Your Bid
                          </label>
                          <input
                            type="number"
                            id="bid"
                            value={bid}
                            onChange={(e) => setBid(Number(e.target.value))}
                            placeholder="Enter your bid"
                            min="1"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Place Bid
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AuctionPage;
