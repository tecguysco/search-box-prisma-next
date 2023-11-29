import Head from "next/head";
import SearchBox from "components/SearchBox";
import ProductsList from "components/ProductsList";
import { parseSearchString } from "utils";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getAllHistorys, createHistory, deleteHistory } from '../prisma/history'

const Searchpage = ({ historys, products }) => {
  const [searchHistorys, setSearchHistorys] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setSearchHistorys(historys);
  }, [historys]);

  const handleDeleteSearchTerm = async (removeIndex) => {
    setSearchHistorys(
      searchHistorys.filter((history, index) => {
        if (index !== removeIndex) return history;
      })
    );

    router.push('/searchpage?deleteId=' + historys[removeIndex].id)
  };

  return (
    <div className="container">
      <Head>
        <title>Next Test App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SearchBox
        history={searchHistorys}
        onDeleteSearchTerm={handleDeleteSearchTerm}
      />
      <ProductsList products={products} />
    </div>
  );
}

let products = [];

export const getServerSideProps = async ({ query }) => {
  try {
    const searchStr = query.searchStr;
    if (searchStr?.length > 0) {
      const isHistory = query.history;
      isHistory? '' : await createHistory(searchStr)
      const targetRes = await fetch(
        `https://redsky.target.com/redsky_aggregations/v1/web/plp_search_v2?key=9f36aeafbe60771e321a7cc95a78140772ab3e96&channel=WEB&count=24&default_purchasability_filter=true&include_sponsored=true&keyword=`+
        parseSearchString(searchStr) + 
        `&new_search=true&offset=0&page=%2Fs%2F`+
        parseSearchString(searchStr) + 
        `&platform=desktop&pricing_store_id=875&scheduled_delivery_store_id=875&store_ids=875%2C55%2C3292%2C1784%2C947&useragent=Mozilla%2F5.0+%28Windows+NT+10.0%3B+Win64%3B+x64%29+AppleWebKit%2F537.36+%28KHTML%2C+like+Gecko%29+Chrome%2F119.0.0.0+Safari%2F537.36&visitor_id=018C17CB9C560201A96E3A30265F7C63&zip=75204`
      );
      const targetData = await targetRes.json();
      products = targetData.data.search.products.slice(0, 9).map((product) => {
        return {
          name: product.item.product_description.title,
          image: {
            src: product.item.enrichment.images.primary_image_url,
            alt: "product image",
          },
          link: product.item.enrichment.buy_url,
        };
      });
    }
    const deleteId = query.deleteId;
    if(deleteId) {
      await deleteHistory(deleteId);
    }
    

    const historys = await getAllHistorys()

    const updatedHistorys = historys.map(history => ({
      ...history,
      updatedAt: history.updatedAt.toString(),
      createdAt: history.createdAt.toString()
    }))

    return {
      props: {
        historys: updatedHistorys,
        products: JSON.parse(JSON.stringify(products)),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { Error: e },
    };
  }
}

export default Searchpage