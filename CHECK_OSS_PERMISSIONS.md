# OSS 权限检查指南

本指南将帮助你确认阿里云 OSS 的权限配置是否正确。

---

## 📋 需要检查的权限

1. **存储桶读写权限**（存储桶级别）
2. **AccessKey 权限**（RAM 用户权限）
3. **静态网站托管权限**

---

## 第一步：检查存储桶读写权限

### 1.1 检查存储桶权限设置

1. 登录 [阿里云控制台](https://ecs.console.aliyun.com/)
2. 搜索 "OSS" 进入 **对象存储 OSS** 控制台
3. 找到你的存储桶（如：`workoutpal-fit`），点击存储桶名称
4. 在左侧菜单：**权限管理** → **读写权限**
5. **确认权限设置**：
   - ✅ **读写权限** 应该设置为：**公共读** 或 **公共读写**
   - ❌ 如果是 **私有**，网站将无法访问

### 1.2 修改存储桶权限（如果需要）

如果权限不是"公共读"：

1. 在 **读写权限** 页面，点击 **修改**
2. 选择 **公共读**（推荐）或 **公共读写**
3. 点击 **确定**
4. ⚠️ 注意：公共读意味着任何人都可以读取文件，但只有授权用户可以写入

---

## 第二步：检查 AccessKey 权限

### 2.1 找到 AccessKey 对应的 RAM 用户

1. 在阿里云控制台右上角头像 → **AccessKey 管理**
2. 找到你使用的 AccessKey ID
3. 记录对应的 **用户名称**（通常是 RAM 子用户）

### 2.2 检查 RAM 用户权限

1. 在阿里云控制台搜索 "RAM" 进入 **访问控制 RAM** 控制台
2. 左侧菜单：**身份管理** → **用户**
3. 找到你的 RAM 用户，点击用户名
4. 查看 **权限管理** 标签页

### 2.3 确认权限策略

你的 RAM 用户需要以下权限之一：

#### 方案 A：完整 OSS 权限（推荐用于测试）

权限策略名称：`AliyunOSSFullAccess`

包含权限：
- `oss:*`（所有 OSS 操作权限）

#### 方案 B：仅特定存储桶权限（推荐用于生产环境）

自定义权限策略，包含以下权限：

```json
{
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "oss:ListObjects",
        "oss:GetObject",
        "oss:PutObject",
        "oss:DeleteObject",
        "oss:ListParts",
        "oss:AbortMultipartUpload",
        "oss:GetObjectMeta"
      ],
      "Resource": [
        "acs:oss:*:*:你的存储桶名称",
        "acs:oss:*:*:你的存储桶名称/*"
      ]
    }
  ]
}
```

### 2.4 添加权限（如果需要）

如果 RAM 用户没有足够的权限：

1. 在 RAM 用户详情页，点击 **添加权限**
2. 选择权限策略：
   - **系统策略**：选择 `AliyunOSSFullAccess`（最简单）
   - **自定义策略**：创建上述自定义策略（更安全）
3. 点击 **确定**

---

## 第三步：测试权限

### 3.1 使用阿里云控制台测试

1. 在 OSS 控制台，进入你的存储桶
2. 尝试上传一个测试文件
3. 如果上传成功，说明写入权限正常
4. 尝试访问文件的 URL，如果能够访问，说明读取权限正常

### 3.2 使用命令行测试（推荐）

如果你本地安装了 `ossutil`，可以使用以下命令测试：

```bash
# 配置 ossutil（如果还没配置）
ossutil config -e 你的Endpoint -i 你的AccessKeyID -k 你的AccessKeySecret -L CH

# 测试列出存储桶内容
ossutil ls oss://你的存储桶名称/

# 测试上传文件
echo "test" > test.txt
ossutil cp test.txt oss://你的存储桶名称/test.txt

# 测试删除文件
ossutil rm oss://你的存储桶名称/test.txt
```

### 3.3 使用 GitHub Actions 测试

优化后的工作流文件已经包含了权限测试步骤：

1. **Check required secrets** - 检查 Secrets 是否配置
2. **Test OSS connection** - 测试 OSS 连接和权限

如果这些步骤失败，会显示详细的错误信息。

---

## 第四步：检查静态网站托管权限

### 4.1 确认静态网站托管已启用

1. 在存储桶详情页，左侧菜单：**基础设置** → **静态网站托管**
2. 确认状态为 **已开启**
3. 确认配置：
   - **默认首页**：`index.html`
   - **默认 404 页**：`index.html`

### 4.2 检查存储桶策略（Bucket Policy）

某些情况下，即使设置了"公共读"，也可能需要额外的存储桶策略：

1. 在存储桶详情页，左侧菜单：**权限管理** → **存储桶策略**
2. 如果有策略，检查是否允许公共读取
3. 如果没有策略，通常不需要添加（"公共读"权限已足够）

---

## 🔍 常见权限问题排查

### 问题 1：GitHub Actions 显示 "AccessDenied"

**可能原因：**
- AccessKey 权限不足
- 存储桶名称或 Endpoint 配置错误

**解决方法：**
1. 检查 RAM 用户是否有 `oss:PutObject` 和 `oss:ListObjects` 权限
2. 确认 GitHub Secrets 中的 `ALIYUN_OSS_BUCKET` 和 `ALIYUN_OSS_ENDPOINT` 正确

### 问题 2：网站无法访问（403 Forbidden）

**可能原因：**
- 存储桶权限不是"公共读"
- 存储桶策略限制了访问

**解决方法：**
1. 将存储桶权限改为"公共读"
2. 检查存储桶策略是否有限制

### 问题 3：可以上传但无法访问文件

**可能原因：**
- 存储桶权限是"私有"
- 文件 ACL 权限不正确

**解决方法：**
1. 将存储桶权限改为"公共读"
2. 上传文件时确保使用公共读权限：
   ```bash
   ossutil cp file.txt oss://bucket/file.txt --acl public-read
   ```

---

## ✅ 权限检查清单

完成以下检查项：

- [ ] 存储桶读写权限设置为"公共读"
- [ ] RAM 用户已添加 OSS 权限策略（`AliyunOSSFullAccess` 或自定义策略）
- [ ] AccessKey 对应的 RAM 用户有正确的权限
- [ ] 静态网站托管已启用
- [ ] GitHub Secrets 已正确配置（4 个密钥）
- [ ] 使用 `ossutil ls` 命令可以列出存储桶内容
- [ ] 使用 `ossutil cp` 命令可以上传文件
- [ ] 上传的文件可以通过 URL 直接访问

---

## 🚀 快速权限配置（推荐）

如果你想要快速配置，使用以下方案：

1. **存储桶权限**：设置为 **公共读**
2. **RAM 用户权限**：添加系统策略 `AliyunOSSFullAccess`
3. **静态网站托管**：启用，默认首页和 404 页都设置为 `index.html`

这样配置后，通常可以解决大部分权限问题。

---

## 📝 安全建议

对于生产环境，建议：

1. **使用自定义权限策略**：只授予特定存储桶的权限，而不是所有 OSS 权限
2. **定期轮换 AccessKey**：定期更换 AccessKey 以提高安全性
3. **使用 RAM 子用户**：不要使用主账号的 AccessKey，创建 RAM 子用户并授予最小权限
4. **监控访问日志**：启用 OSS 访问日志，定期检查异常访问

---

## 🔗 相关链接

- [阿里云 OSS 权限控制文档](https://help.aliyun.com/document_detail/31859.html)
- [RAM 权限策略语法](https://help.aliyun.com/document_detail/93733.html)
- [OSS 存储桶权限设置](https://help.aliyun.com/document_detail/31885.html)
