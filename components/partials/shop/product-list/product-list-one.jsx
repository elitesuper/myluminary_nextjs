import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';

import ToolBox from '~/components/partials/shop/toolbox';
import ProductTwo from '~/components/features/product/product-two';
import ProductEight from '~/components/features/product/product-eight';
import Pagination from '~/components/features/pagination';

import withApollo from '~/server/apolloClient';
import { GET_PRODUCTS } from '~/server/queries';
import { bestSellingProducts } from '~/utils/data/tempdata';

function ProductListOne( props ) {
    const { itemsPerRow = 3, type = "left", isToolbox = true } = props;
    const router = useRouter();
    const query = router.query;
    const { data, loading, error } = useQuery( GET_PRODUCTS );
    const [products, setProducts] = useState(data && data.products.products);
    const gridClasses = {
        3: "cols-2 cols-sm-3",
        4: "cols-2 cols-sm-3 cols-md-4",
        5: "cols-2 cols-sm-3 cols-md-4 cols-xl-5",
        6: "cols-2 cols-sm-3 cols-md-4 cols-xl-6",
        7: "cols-2 cols-sm-3 cols-md-4 cols-lg-5 cols-xl-7",
        8: "cols-2 cols-sm-3 cols-md-4 cols-lg-5 cols-xl-8"
    }
    const perPage = query.per_page ? parseInt( query.per_page ) : 12;
    const totalPage = products ? parseInt( products.length / perPage ) + ( products.length % perPage ? 1 : 0 ) : 1;
    const page = query.page ? query.page : 1;
    const gridType = query.type ? query.type : 'grid';

    // useEffect( () => {
    //     if(!loading){
    //         console.log(loading)
    //         if(query.category){
    //             setProducts(data.products.products.filter(item=> item.category.slug == query.category))
    //         }else{
    //             setProducts(data.products.products)
    //         }
    //     }else {
    //         getProducts();
    //     }
    // }, [ query, loading ] )

    useEffect(() => {
        if(!loading){
            if(query.category){
                data && setProducts(data.products.products.filter(item=> item.category.slug == query.category))
            }else{
                data && setProducts(data.products.products)
            }
        }
    }, [loading, query]) 

    return (
        <>
            {
                isToolbox ? <ToolBox type={ type } /> : ''
            }
            {
                loading ?
                    gridType === 'grid' ?
                        <div className={ `row product-wrapper ${ gridClasses[ itemsPerRow ] }` }>
                            {
                                [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ].map( ( item ) =>
                                    <div className="product-loading-overlay" key={ 'popup-skel-' + item }></div>
                                )
                            }
                        </div> :
                        <div className="row product-wrapper skeleton-body cols-1">
                            {
                                [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ].map( ( item ) =>
                                    <div className="skel-pro skel-pro-list mb-4" key={ 'list-skel-' + item }></div>
                                )
                            }
                        </div>
                    : ''
            }
            {
                gridType === 'grid' ?
                    <div className={ `row product-wrapper ${ gridClasses[ itemsPerRow ] }` }>
                        { products && products.map( item =>
                            <div className="product-wrap" key={ 'shop-' + item.slug }>
                                <ProductTwo product={ item } adClass="" />
                            </div>
                        ) }
                    </div>
                    :
                    <div className="product-lists product-wrapper">
                        { products && products.map( item =>
                            <ProductEight product={ item } key={ 'shop-list-' + item.slug } />
                        ) }
                    </div>
            }

            {
                products && products.length === 0 ?
                    <p className="ml-1">No products were found matching your selection.</p> : ''
            }

            {
                products && products.length > 0 ?
                    <div className="toolbox toolbox-pagination">
                        {
                            products && <p className="show-info">Showing <span>{ perPage * ( page - 1 ) + 1 } - { Math.min( perPage * page, products.length ) } of { products.length }</span>Products</p>
                        }

                        <Pagination totalPage={ totalPage } />
                    </div> : ''
            }
        </>
    )
}

export default withApollo( { ssr: typeof window === 'undefined' } )( ProductListOne );