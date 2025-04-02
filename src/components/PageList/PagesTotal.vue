<template>
    <div class="pagination-container">
        <!-- Lựa chọn kích thước trang -->
        <div class="page-size-section">
            <label for="pageSize" class="page-size-label">頁面大小:</label>
            <select v-model="pageSize" @change="updatePageSize" class="page-size-select">
                <option v-for="item in pageSizeList" :key="item" :value="item">{{ item }}</option>
            </select>
        </div>

        <!-- Điều hướng trang -->
        <div class="navigation-section">
            <!-- Nút lùi lại trang -->
            <button 
                @click="backPage" 
                :disabled="page === 1" 
                class="nav-button"
                style="font-size: 8px;"
            >
            上一頁
            </button>

            <!-- Chọn dãy số trang -->
            <ul class="page-list">
                <li 
                    v-for="pages1 in pages" 
                    :key="pages1" 
                    @click="gotoPage(pages1)"
                    :class="['page-item', { active: pages1 == page }]"
                    style="font-size: 8px;"
                >
                    {{ pages1 }}
                </li>
            </ul>

            <!-- Nút chuyển tới trang -->
            <button 
                @click="nextPage" 
                :disabled="page === totalPage" 
                class="nav-button"
                style="font-size: 8px;"
            >
            下一頁
            </button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        page: Number,
        totalPage: Number,
        valueE: String
    },
    data() {
        return {
            pageSizeList: [2, 5, 10, 20, 30, 100, 200, 500, 1000, 2000, 3000, 5000, 10000, 22000], // Các kích thước trang
            pageSize: 5 // Kích thước mặc định
        };
    },
    computed: {
        pages() {
            // Tính toán dãy số trang
            const pageItem = [];
            for (let i = 1; i <= this.totalPage; i++) {
                if (i === 1 || i === this.totalPage || (i <= this.page + 2 && i >= this.page - 2)) {
                    pageItem.push(i);
                } else if (i === this.page + 3 || i === this.page - 3) {
                    pageItem.push("...");
                }
            }
            return pageItem;
        }
    },
    methods: {
        updatePageSize() {
            this.$emit("pageSizeChange", this.pageSize);
        },
        gotoPage(page) {
            if (page === '...') {
                return;
            }
            this.$emit("pageChange", this.valueE, page);
        },
        backPage() {
            if (this.page > 1) {
                this.$emit("pageChange", this.valueE, this.page - 1);
            }
        },
        nextPage() {
            if (this.page < this.totalPage) {
                this.$emit("pageChange", this.valueE, this.page + 1);
            }
        }
    }
};
</script>

<style>
.pagination-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Arial, sans-serif;
}

.page-size-section {
    margin-bottom: 20px;
    text-align: center;
}

.page-size-label {
    font-weight: bold;
    margin-right: 10px;
}

.page-size-select {
    padding: 5px 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    transition: all 0.3s;
}

.page-size-select:hover {
    border-color: #007BFF;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.navigation-section {
    display: flex;
    align-items: center;
    gap: 10px;
}

.nav-button {
    background-color: #007BFF;
    color: #fff;
    border: none;
    padding: 10px 15px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
}

.nav-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.nav-button:hover:not(:disabled) {
    background-color: #0056b3;
}

.page-list {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
}

.page-item {
    padding: 10px 15px;
    margin: 0 2px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
    background-color: #f9f9f9;
}

.page-item:hover {
    background-color: #e9ecef;
}

.page-item.active {
    background-color: #007BFF;
    color: #fff;
    font-weight: bold;
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 5px #007BFF;
    }
    50% {
        box-shadow: 0 0 15px #007BFF;
    }
    100% {
        box-shadow: 0 0 5px #007BFF;
    }
}
</style>
