import React from 'react';
import { motion } from 'motion/react';
import { Starburst } from './ComicElements';
import { useData } from '@/context/DataContext';
import clustersData from '@/data/clusters_data.json';

export function ClustersBook() {
  const { selectedCluster, selectCluster } = useData();
  const clusters = clustersData.clusters;

  // Split clusters into grid items and the final featured item
  const gridClusters = clusters.slice(0, clusters.length - 1);
  const finalCluster = clusters[clusters.length - 1];

  return (
    <div className="h-full flex flex-col">
      {/* Page Title */}
      <div className="text-center mb-6">
        <Starburst color="#F4A261" size={120}>
          Clusters
        </Starburst>
      </div>

      <h1
        className="comic-title text-center"
        style={{
          fontSize: "40px",
          fontWeight: "bold",
          marginBottom: "8px",
          color: "#1A1A1A",
        }}
      >
        Distinct humor types identified through machine learning analysis
      </h1>

      {/* Clusters Grid */}
      <div className="grid grid-cols-2 gap-4 flex-1">
        {gridClusters.map((cluster, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => selectCluster(cluster.name)}
            className={`border-4 border-[#1A1A1A] p-4 bg-white relative overflow-hidden cursor-pointer transition-all duration-300 ${selectedCluster === cluster.name
              ? 'selected-state'
              : 'hover:scale-105'
              }`}
            style={{
              boxShadow: selectedCluster === cluster.name
                ? `0 0 20px ${cluster.color}, 4px 4px 0 #1A1A1A`
                : '4px 4px 0 #1A1A1A',
            }}
          >
            {/* Background color */}
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundColor: cluster.color }}
            />

            <div className="relative z-10">
              {/* Title */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-4 h-4 border-2 border-[#1A1A1A] rounded-full flex items-center justify-center text-[10px]"
                  style={{ backgroundColor: cluster.color }}
                >
                  {/* Optional: Icon inside circle or just color */}
                </div>
                <h3 className="comic-title text-sm truncate" style={{ color: cluster.color }}>
                  {cluster.name}
                </h3>
              </div>

              {/* Percentage */}
              <div className="mb-3">
                <span className="comic-title text-3xl" style={{ color: cluster.color }}>
                  {cluster.percentage}%
                </span>
              </div>

              {/* Description */}
              <p className="comic-text text-xs mb-3 opacity-80 line-clamp-2">
                {cluster.description}
              </p>

              {/* Keywords */}
              <div className="flex flex-wrap gap-1">
                {cluster.keywords.slice(0, 3).map((keyword, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-1 bg-[#FDFDF8] border border-[#1A1A1A] comic-text"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Final cluster - full width at bottom */}
      {finalCluster && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={() => selectCluster(finalCluster.name)}
          className={`border-4 border-[#1A1A1A] p-4 bg-white relative overflow-hidden mt-4 cursor-pointer transition-all duration-300 ${selectedCluster === finalCluster.name
            ? 'selected-state'
            : 'hover:scale-105'
            }`}
          style={{
            boxShadow: selectedCluster === finalCluster.name
              ? `0 0 20px ${finalCluster.color}, 4px 4px 0 #1A1A1A`
              : '4px 4px 0 #1A1A1A'
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundColor: finalCluster.color }}
          />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-4 h-4 border-2 border-[#1A1A1A] rounded-full"
                  style={{ backgroundColor: finalCluster.color }}
                />
                <h3 className="comic-title text-sm" style={{ color: finalCluster.color }}>
                  {finalCluster.name}
                </h3>
              </div>
              <p className="comic-text text-xs opacity-80">
                {finalCluster.description}
              </p>
            </div>

            <div className="text-right pl-4">
              <span className="comic-title text-3xl" style={{ color: finalCluster.color }}>
                {finalCluster.percentage}%
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Note */}
      <div className="mt-4 text-center">
        <p className="handwritten text-sm text-[#8B4513] opacity-70">
          Identified using k-means clustering with TF-IDF vectorization
        </p>
      </div>
    </div>
  );
}
