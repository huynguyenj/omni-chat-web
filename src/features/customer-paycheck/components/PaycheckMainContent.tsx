import Button from '@/components/ui/button/Button'
import NodataCard from '@/components/ui/card/NodataCard'
import PaginationBar from '@/components/ui/pagination/PaginationBar'

export default function PaycheckMainContent() {
  return (
    <div>
      {/* {listProducts && listProducts.items.length > 0 ?
        <div>
          <div className='overflow-x-auto'>
            <table className='w-full border border-border-primary my-3 table-fixed min-w-250 '>
              <thead className='bg-secondary'>
                <tr className='text-white'>
                  <th className='py-2 text-start px-5 w-1/6'>STT</th>
                  <th className='py-2 text-start px-5 w-1/3'>Tên sản phẩm</th>
                  <th className='py-2 text-start px-5 w-1/4'>Ảnh</th>
                  <th className='py-2 text-start px-5 w-1/3'>Hãng</th>
                  <th className='py-2 text-start px-5 w-1/4'>Loại sữa</th>
                  <th className='py-2 text-start px-5 w-1/4'>Loại hộp</th>
                  <th className='py-2 text-start px-5 w-1/4'>Dung tích</th>
                  <th className='py-2 text-end px-5 w-1/4'>Số lượng</th>
                  <th className='py-2 text-end px-5 w-1/4'>Giá</th>
                  <th className='py-2 text-end px-5 w-1/4'>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {listProducts.items.map((product, i) => (
                  <tr key={product.id}>
                    <td className='py-2 px-5 w-1/6 border-r border-b-2 border-border-primary'>
                      <p>{i + 1}</p>
                    </td>
                    <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary'>
                      <p>{product.name}</p>
                    </td>
                    <td className='py-2 px-5 w-1/4 wrap-break-word border-r border-b-2 border-border-primary'>
                      { product.imageUrl ?
                        <img src={product.imageUrl} alt='avatar' className='shrink-0 w-20 h-20 object-contain'/>
                        :
                        <div className="shrink-0 h-20 w-20 rounded-full bg-[#3366CC] text-white flex items-center justify-center font-semibold">
                          {product.name.charAt(0)}
                        </div>
                      }
                    </td>
                    <td className='py-2 px-5 w-1/6 border-r border-b-2 border-border-primary'>
                      <p>{product.brand}</p>
                    </td>
                    <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary'>
                      <p>{PRODUCT_TYPE[product.productKind].name}</p>
                    </td>
                    <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary'>
                      <p>{PRODUCT_PACKAGE_TYPE[product.productPackagingType]}</p>
                    </td>
                    <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary'>
                      <p>{product.volumeMl}ml</p>
                    </td>
                    <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary text-end'>
                      <p>{product.quantity}</p>
                    </td>
                    <td className='py-2 px-5 w-1/4 border-r border-b-2 border-border-primary text-end'>
                      <p>{product.price.toLocaleString()}đ</p>
                    </td>
                    <td className='py-2 px-5 border-r border-b-2 border-border-primary'>
                      <div className='grid grid-cols-2 justify-end items-center gap-2 '>
                        <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-60' onClick={() => handleBatchShowSelect(product.id)}>
                          <LuPackage className='text-secondary size-5'/>
                        </Button>
                        <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-60' onClick={() => handleUpdateProductInfo(product)}>
                          <Edit className='text-secondary size-5'/>
                        </Button>
                        <Button className='p-0 bg-transparent hover:bg-transparent hover:opacity-60' onClick={() => handleOpenAlert(product.id)}>
                          <Trash2 className='text-red-500 size-5'/>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <PaginationBar
              currentPage={currentPage}
              setPage={setCurrentPage}
              totalPage={listProducts.meta.total_pages}
            />
          </div>
        </div>
        :
        <NodataCard content='Không có dữ liệu sản phẩm'/>
      } */}
    </div>
  )
}
