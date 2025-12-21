'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface TimelineEvent {
  id: string;
  date: string;
  year: number;
  cluster: string;
}

export interface DataContextType {
  // Selection state
  selectedCluster: string | null;
  selectedTimeframe: number | null;
  selectedGender: 'all' | 'men' | 'women';
  
  // Actions
  selectCluster: (clusterName: string | null) => void;
  selectTimeframe: (year: number | null) => void;
  selectGender: (gender: 'all' | 'men' | 'women') => void;
  resetFilters: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<number | null>(null);
  const [selectedGender, setSelectedGender] = useState<'all' | 'men' | 'women'>('all');

  const selectCluster = (clusterName: string | null) => {
    setSelectedCluster(selectedCluster === clusterName ? null : clusterName);
  };

  const selectTimeframe = (year: number | null) => {
    setSelectedTimeframe(selectedTimeframe === year ? null : year);
  };

  const selectGender = (gender: 'all' | 'men' | 'women') => {
    setSelectedGender(gender);
  };

  const resetFilters = () => {
    setSelectedCluster(null);
    setSelectedTimeframe(null);
    setSelectedGender('all');
  };

  const value: DataContextType = {
    selectedCluster,
    selectedTimeframe,
    selectedGender,
    selectCluster,
    selectTimeframe,
    selectGender,
    resetFilters,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
