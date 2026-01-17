# 阿里云 OSS 部署配置指南

> **目标**：让中国大陆用户（无需 VPN）能够正常访问网站

本指南将帮助你完成阿里云 OSS 配置，实现自动化部署。

## 📋 前置准备

- 已购买域名：`workoutpal.fit`
- 阿里云账号
- GitHub 仓库

---

## 第一步：创建 OSS 存储桶

### 1.1 创建存储桶

1. 登录 [阿里云控制台](https://ecs.console.aliyun.com/)
2. 搜索 "OSS" 进入 **对象存储 OSS** 控制台
3. 点击 **创建 Bucket**
4. 配置：
   - **Bucket 名称**：`workoutpal-fit`（必须全局唯一）
   - **地域**：选择离你最近的区域（如：华东1-杭州）
   - **存储类型**：**标准存储**
   - **读写权限**：**公共读** ⚠️（必须！否则无法访问）
   - 其他选项保持默认即可
5. 点击 **确定**

### 1.2 配置静态网站托管

1. 点击刚创建的存储桶名称
2. 左侧菜单：**基础设置** → **静态网站托管**
3. 点击 **设置**，启用静态网站托管
4. 配置：
   - **默认首页**：`index.html`
   - **默认 404 页**：`index.html`
5. 点击 **保存**

### 1.3 绑定自定义域名

1. 在存储桶左侧菜单：**传输管理** → **域名管理**
2. 点击 **绑定域名**
3. 配置：
   - **域名**：`workoutpal.fit`
   - **加速区域**：**仅中国内地**（或根据需求选择）
   - **HTTPS证书**：选择 **阿里云SSL证书（免费）** 或 **其他证书**
     - 如果选择阿里云免费证书：点击 **申请证书**，按提示完成申请
     - 如果选择其他证书：需要上传你的 SSL 证书
4. 点击 **提交**
5. 等待审核（通常几分钟）

### 1.4 记录信息

记录以下信息（后续需要）：
- **Bucket 名称**：`workoutpal-fit`
- **Endpoint**：例如 `oss-cn-hangzhou.aliyuncs.com`（在存储桶概览页面可以看到）

---

## 第二步：配置域名解析

1. 在阿里云控制台搜索 "域名" 进入 **域名** 控制台
2. 找到域名 `workoutpal.fit` → **解析设置**
3. 点击 **添加记录**
4. 配置：
   - **记录类型**：`CNAME`
   - **主机记录**：`@`（主域名）
   - **记录值**：填写 OSS 域名管理中显示的 CNAME 地址（例如：`workoutpal-fit.oss-cn-hangzhou.aliyuncs.com`）
     - ⚠️ 注意：记录值是 OSS 存储桶的域名，格式为：`你的存储桶名称.地域.aliyuncs.com`
5. 点击 **确定**

### 查看 OSS CNAME 地址

在 OSS 控制台 → **域名管理** → 找到你绑定的域名，可以看到 **CNAME** 地址，这就是解析记录值。

---

## 第三步：配置 GitHub Secrets

### 3.1 获取阿里云 AccessKey

1. 阿里云控制台右上角头像 → **AccessKey 管理**
2. 完成安全验证
3. 点击 **创建 AccessKey**
4. **重要**：记录以下信息（只显示一次）：
   - **AccessKey ID**
   - **AccessKey Secret**

### 3.2 在 GitHub 添加 Secrets

1. 打开 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**，添加以下 4 个密钥：

   | Name | Value |
   |------|-------|
   | `ALIYUN_ACCESS_KEY_ID` | 你的 AccessKey ID |
   | `ALIYUN_ACCESS_KEY_SECRET` | 你的 AccessKey Secret |
   | `ALIYUN_OSS_BUCKET` | 你的存储桶名称（如：`workoutpal-fit`） |
   | `ALIYUN_OSS_ENDPOINT` | 你的 OSS Endpoint（如：`oss-cn-hangzhou.aliyuncs.com`） |

   ⚠️ Endpoint 只需要域名部分，不需要 `https://` 前缀

---

## 第四步：测试部署

1. 推送代码到 `master` 分支
2. 在 GitHub 仓库的 **Actions** 标签页查看部署进度
3. 等待部署完成（通常 2-5 分钟）
4. 等待几分钟让域名解析生效
5. 访问 `https://workoutpal.fit` 验证

---

## 🔧 常见问题

**Q: 网站显示 403 或无法访问？**  
A: 检查 OSS 存储桶的读写权限是否为 **公共读**。

**Q: 刷新页面后显示 404？**  
A: 确保 OSS 静态网站托管中 **默认 404 页** 设置为 `index.html`。

**Q: 域名解析后无法访问？**  
A: 
- 检查域名解析记录值是否正确（应该是 OSS 的 CNAME 地址）
- 等待几分钟让 DNS 解析生效
- 确认 OSS 域名管理中域名状态为 **已启用**

**Q: HTTPS 证书未生效？**  
A: 在 OSS 域名管理中检查证书状态，确保证书已正确配置并已启用。

**Q: GitHub Actions 部署失败？**  
A: 检查 GitHub Secrets 是否配置正确，查看 Actions 日志中的错误信息。

---

## 📝 配置检查清单

- [ ] OSS 存储桶已创建，权限为 **公共读**
- [ ] OSS 静态网站托管已启用，默认首页和 404 页都设置为 `index.html`
- [ ] OSS 自定义域名已绑定并配置 HTTPS 证书
- [ ] 域名解析已配置（CNAME 指向 OSS）
- [ ] GitHub Secrets 已配置（4 个密钥）
- [ ] 代码已推送到 master 分支，GitHub Actions 部署成功
- [ ] 网站可以正常访问

---

## 🎉 完成！

配置完成后，每次推送代码到 `master` 分支，GitHub Actions 会自动：
1. 构建项目
2. 部署到 GitHub Pages
3. 部署到阿里云 OSS（国内用户可正常访问）

现在中国大陆用户无需 VPN 即可访问你的网站了！

---

## 💡 关于 OSS 访问

- OSS 存储桶配置为公共读后，可以通过 OSS 的默认域名直接访问（格式：`你的存储桶名.地域.aliyuncs.com`）
- 绑定自定义域名后，可以通过你的域名 `workoutpal.fit` 访问
- 配置 HTTPS 证书后，可以使用 `https://workoutpal.fit` 访问
