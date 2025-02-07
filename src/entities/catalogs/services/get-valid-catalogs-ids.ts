import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { unstable_noStore } from "next/cache";

import { COLLECTION } from "~/shared/lib/firebase/collections";
import { db } from "~/shared/lib/firebase/config";
import { ValidMetadata } from "~/shared/types-schema/types";

export async function getValidCatalogIds() {
  unstable_noStore();
  let catalogListData: ValidMetadata[] = [];
  const catalogsCollectionRef = collection(db, COLLECTION.catalogs);

  // Filter the catalog, where totalVideos is greater than 0 and pageviews are sorted 'desc'
  const validCatalogQuery = query(
    catalogsCollectionRef,
    where("data.totalVideos", ">", 0),
    orderBy("pageviews", "desc"),
    limit(50)
  );

  const catalogsDoc = await getDocs(validCatalogQuery);
  const catalogIds = catalogsDoc.docs.map((catalog) => catalog.id);

  // Get the title and description of the page
  // Awaiting using a Promise.all is done to wait for the map to execute before returning the response
  await Promise.all(
    catalogIds.map(async (catalogId) => {
      const catalogData = await getCatalogMetadata(catalogId);
      if (catalogData) {
        const metaData: ValidMetadata = {
          description: catalogData?.description,
          id: catalogId,
          pageviews: catalogData.pageviews ?? 0,
          thumbnails: getVideoThumbnails(catalogData),
          title: catalogData?.title,
          totalVideos: catalogData?.data?.totalVideos,
          updatedAt: catalogData?.data.updatedAt.toDate(),
        };

        catalogListData.push(metaData);
      }
    })
  );

  return catalogListData;
}

const getCatalogMetadata = async (catalogId: string) => {
  const catalogRef = doc(db, COLLECTION.catalogs, catalogId);
  const catalogSnap = await getDoc(catalogRef);
  const catalogData = catalogSnap.data();
  return catalogData;
};

const getVideoThumbnails = (catalogData: DocumentData) => {
  const videos = catalogData.data.videos;
  const dayThumbnails = videos.day.map((video: any) => video.thumbnail.url);
  const weekThumbnails = videos.week.map((video: any) => video.thumbnail.url);
  const monthThumbnails = videos.month.map((video: any) => video.thumbnail.url);
  return [...dayThumbnails, ...weekThumbnails, ...monthThumbnails];
};
