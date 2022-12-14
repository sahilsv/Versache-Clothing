import { useParams } from "react-router-dom";
import { useContext, useState, useEffect, Fragment } from "react";

import ProductCard from "../../components/product-card/product-card.component";
import { CategoriesContext } from "../../contexts/categories.context";
import {CategoryContainer, Title} from "./category.styles";

const Category = () => {
  // to get category, i.e, jackets, hats etc using useParams()
  const { category } = useParams();
  const { categoriesMap } = useContext(CategoriesContext);

  // We could also do products = categoriesMap[category];
  // but it will render everytime, so we need it to re-render only when either
  // the category or categoriesMap changes
  const [products, setProducts] = useState(categoriesMap[category]);

  useEffect(() => {
    setProducts(categoriesMap[category]);
  }, [category, categoriesMap]);

  return (
    <Fragment>
      <Title>{category.toLocaleUpperCase()}</Title>
      <CategoryContainer>
        {products &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </CategoryContainer>
    </Fragment>
  );
};

export default Category;
