import Card from '@/components/ui/card/Card'
import NodataCard from '@/components/ui/card/NodataCard'
import { AdvSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select/AdvSelect'
import useGetAllBrand from '@/features/chat/hooks/useGetAllBrand'
import useGetProductForGuest from '@/features/product/hooks/useGetProductForGuest'
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa'
import ProductUnavailable from '@/assets/product-unavailable.png'
import PaginationBar from '@/components/ui/pagination/PaginationBar'
import useDebounce from '@/hooks/useDebounce'
import Input from '@/components/ui/input/Input'
import { Search } from 'lucide-react'
import Button from '@/components/ui/button/Button'
import ProductGuestCardSkeleton from '@/components/ui/skeleton/ProductGuestCardSkeleton'
export default function ProductPage() {
  const { listBrand } = useGetAllBrand()
  const { brandId, currentPage, isDescending, listProductData, packageType, productKind, setBrandId, setCurrentPage, setPackageType, setProductKind, setSearchText, setSortBy, setVolume, sortBy, volume, handleSetDescending, loading } = useGetProductForGuest()

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const debounce = useDebounce(handleSearch, 400)
  return (
    <div className='w-full min-h-screen h-fit px-20 py-15 text-sm-body-desktop bg-[#fafafa]'>
      <div className='w-full bg-white rounded-xl px-8 py-5 shadow-[0px_0px_5px_1px_rgba(0,0,0,0.1)]'>
        <h1 className='text-sm-title-desktop text-primary font-medium'>Danh sách sản phẩm</h1>
        <div className='flex items-center justify-between gap-2 my-2'>
          <div className='flex items-center gap-2 w-1/2'>
            <div className='flex flex-col gap-2 w-full'>
              <p className='font-medium text-nowrap'>Hãng sữa: </p>
              <AdvSelect
                defaultValue='All'
                value={brandId}
                onValueChange={setBrandId}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Chọn hãng sữa'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='All'>Tất cả</SelectItem>
                  { listBrand.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                  )) }
                </SelectContent>
              </AdvSelect>
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <p className='font-medium text-nowrap'>Loại sữa: </p>
              <AdvSelect
                defaultValue='All'
                value={productKind}
                onValueChange={setProductKind}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Chọn loại sữa'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='All'>Tất cả</SelectItem>
                  <SelectItem value='Sugar'>Sữa có đường</SelectItem>
                  <SelectItem value='NoSugar'>Sữa không đường</SelectItem>
                  <SelectItem value='Yogurt'>Sữa chua</SelectItem>
                </SelectContent>
              </AdvSelect>
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <p className='font-medium text-nowrap'>Loại hộp sữa: </p>
              <AdvSelect
                defaultValue='All'
                value={packageType}
                onValueChange={setPackageType}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Chọn loại hộp'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='All'>Tất cả</SelectItem>
                  <SelectItem value='Bottle'>Chai</SelectItem>
                  <SelectItem value='Carton'>Hộp giấy</SelectItem>
                </SelectContent>
              </AdvSelect>
            </div>
            <div className='flex flex-col gap-2 w-full'>
              <p className='font-medium text-nowrap'>Dung tích sữa: </p>
              <AdvSelect
                defaultValue='All'
                value={volume}
                onValueChange={setVolume}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Chọn dung tích'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='All'>Tất cả</SelectItem>
                  <SelectItem value='180'>180ml</SelectItem>
                  <SelectItem value='490'>490ml</SelectItem>
                  <SelectItem value='880'>880ml</SelectItem>
                  <SelectItem value='1760'>1760ml</SelectItem>
                </SelectContent>
              </AdvSelect>
            </div>
          </div>
          <div className='flex flex-col w-50 gap-2'>
            <p className='font-medium text-nowrap'>Sắp xếp: </p>
            <div className='flex items-center gap-5'>
              <AdvSelect
                defaultValue='createdate'
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Sắp xếp theo'/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='createdate'>Ngày tạo</SelectItem>
                  <SelectItem value='name'>Tên</SelectItem>
                  <SelectItem value='quantity'>Số lượng</SelectItem>
                  <SelectItem value='volumeMl'>Dung tích</SelectItem>
                  <SelectItem value='price'>Giá</SelectItem>
                  <SelectItem value='brand'>Hãng</SelectItem>
                </SelectContent>
              </AdvSelect>
              <Button onClick={handleSetDescending}>
                { isDescending ?
                  <FaSortAmountUp className='size-5'/>
                  :
                  <FaSortAmountDown className='size-5'/>
                }
              </Button>
            </div>
          </div>
        </div>
        <Input variant='gray' icon={Search} placeholder='Tìm tên sản phẩm...' onChange={(e) => debounce(e.target.value)}/>
        { loading ?
          <ProductGuestCardSkeleton count={3}/>
          :
          <>
            { listProductData && listProductData.items.length > 0 ?
              <>
                <div className='grid md:grid-cols-3 my-5 gap-5 w-full'>
                  { listProductData && listProductData.items.length > 0 &&
                    listProductData.items.map((product) => (
                      <Card className='flex flex-col p-5 rounded-2xl border-border-primary'>
                        <div className='w-full h-50 rounded-xl'>
                          <img src={product.imageUrl ? product.imageUrl : ProductUnavailable } alt="product_image" className='w-full h-full object-contain'/>
                        </div>
                        <p className='text-[0.9rem] font-medium'>Code: {product.code} </p>
                        <div className='flex justify-between items-center'>
                          <p className='text-xl-body-desktop font-medium'>{product.name}</p>
                          <p className='text-xl-body-desktop font-bold text-green-accent'>{product.price.toLocaleString()}đ</p>
                        </div>
                        <p className=''>{product.description}</p>
                        <p className='font-medium'>Hãng: <span>{product.brand}</span></p>
                        <div className='flex justify-between items-center'>
                          <p>Dung tích: {product.volumeMl}ml</p>
                          <p>Loại hộp: {product.productKind === 'Bottle' ? 'Chai' : 'Hộp giấy'}</p>
                        </div>
                      </Card>
                    ))
                  }
                </div>
                <PaginationBar
                  currentPage={currentPage}
                  setPage={setCurrentPage}
                  totalPage={listProductData?.meta.total_pages}
                />
              </>
              :
              <NodataCard content='Không tìm thấy sản phẩm'/>
            }
          </>
        }
      </div>
    </div>
  )
}
