# R-tree：空間資料搜尋的高效演算法

現在工作上有個使用線性演算法，計算現在位置（lat, lon）是否落在設定的多個矩形區域內。計算量是 O(n)。所以考慮使用 R-tree 來優化這個查詢。

## 現在的設計
```go
type Rectangle struct {
    MinX, MinY, MaxX, MaxY float64
}

func IsPointInRect(lat, lon float64, rect Rectangle) bool {
    return lat >= rect.MinY && lat <= rect.MaxY && lon >= rect.MinX && lon <= rect.MaxX
}
```

線性搜尋的計算複雜度是 O(n)，也就是說，當你有 n 個矩形時，每查詢一個點都要檢查 n 次。

這種方法在資料量小時還可以接受，但當矩形數量變多（例如幾千、幾萬個）時，查詢速度會明顯變慢。

尤其在即時應用（如地圖定位、遊戲碰撞偵測）中，線性搜尋會成為效能瓶頸。因此需要考慮更高效的空間索引結構，例如 R-tree。



## 什麼是 R-tree？
https://tanishiking24.hatenablog.com/entry/introduction_rtree_index

R-tree（Rectangle-tree）是一種專門用來儲存多維空間物件（如矩形、方盒、區域等）的樹狀資料結構。它的設計目的是讓「區域查詢」和「鄰近查詢」等操作變得高效。

R-tree 的每個節點都代表一個最小包圍矩形（MBR, Minimum Bounding Rectangle），而樹的葉節點則儲存實際的資料物件（例如地圖上的建築物、道路等）。

## R-tree 的結構

- **每個節點**：包含多個子節點或資料物件，每個子節點都有一個 MBR。
- **非葉節點**：儲存子節點的 MBR。
- **葉節點**：儲存實際的空間物件及其 MBR。

## R-tree 的操作

1. **插入（Insert）**：將新物件插入最適合的葉節點，若節點已滿則分裂。
2. **查詢（Search）**：例如「給定一個點，找出所有包含該點的方盒」。從根節點開始，遞迴檢查與查詢點有重疊的 MBR。
3. **刪除（Delete）**：移除物件，必要時合併節點。

## R-tree 如何搜尋點？


假設你有很多矩形區域（例如地圖上的建築物），想要查詢某個點（例如 GPS 位置）落在哪些區域內。R-tree 會從根節點開始，檢查哪些子節點的 MBR 包含這個點，然後遞迴往下直到葉節點，最後回傳所有包含該點的物件。

這種搜尋方式比單純暴力搜尋（每個方盒都檢查一次）快很多，尤其在資料量很大時效果更明顯。

## R-tree 計算量
R-tree 的查詢效率通常是 O(log n)，這意味著即使在大量資料的情況下，查詢速度也能保持在合理範圍內。這是因為 R-tree 的結構特性使得它能夠快速排除不相關的區域，從而減少需要檢查的矩形數量。

## Golang R-tree 實作：rtreego

身為 Golang 開發者，可以直接使用 [rtreego](https://github.com/dhconnelly/rtreego) 這個套件來操作 R-tree。rtreego 提供簡單易用的 API，可以讓你快速建立 R-tree 結構，並進行空間查詢，例如：

```go
import "github.com/dhconnelly/rtreego"

// 建立一個 R-tree，設定每個節點最多 25 個子節點
tree := rtreego.NewTree(2, 25, 50)

// 插入物件（需實作 rtreego.Spatial 介面）
tree.Insert(obj)

// 查詢包含某個點的所有物件
results := tree.Search(point.ToRect(0.0))
```


## 小結
R-tree 是一種非常適合用來管理和查詢多維空間資料的資料結構，特別適合用來解決「在大量矩形中搜尋點」的問題。

---

參考資料：
- [rtreego (Golang R-tree library)](https://github.com/dhconnelly/rtreego)
- [R-tree: A Dynamic Index Structure for Spatial Searching](https://dl.acm.org/doi/10.1145/602259.602266)
