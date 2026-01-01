import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

/**
 * Custom decorator để lấy IP thực của client, hỗ trợ cả reverse proxy
 *
 * Thứ tự ưu tiên:
 * 1. X-Forwarded-For (từ reverse proxy như Nginx, CloudFlare, AWS ALB)
 * 2. X-Real-IP (từ Nginx)
 * 3. CF-Connecting-IP (từ CloudFlare)
 * 4. X-Client-IP
 * 5. request.ip (fallback cho development)
 *
 * @example
 * ```typescript
 * @Post('login')
 * async login(@RealIp() ip: string) {
 *   console.log('Client IP:', ip);
 * }
 * ```
 */
export const RealIp = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest<Request>();

  // Hàm helper để lấy IP từ header
  const getHeaderValue = (headerName: string): string | undefined => {
    const value = request.headers[headerName.toLowerCase()];
    if (Array.isArray(value)) {
      return value[0];
    }
    return value;
  };

  // 1. Kiểm tra X-Forwarded-For (chuẩn nhất cho reverse proxy)
  // Format: "client, proxy1, proxy2"
  const xForwardedFor = getHeaderValue('x-forwarded-for');
  if (xForwardedFor) {
    // Lấy IP đầu tiên (IP của client thực)
    const ips = xForwardedFor.split(',').map((ip) => ip.trim());
    const clientIp = ips[0];
    if (clientIp && isValidIp(clientIp)) {
      return clientIp;
    }
  }

  // 2. Kiểm tra X-Real-IP (Nginx)
  const xRealIp = getHeaderValue('x-real-ip');
  if (xRealIp && isValidIp(xRealIp)) {
    return xRealIp;
  }

  // 3. Kiểm tra CF-Connecting-IP (CloudFlare)
  const cfConnectingIp = getHeaderValue('cf-connecting-ip');
  if (cfConnectingIp && isValidIp(cfConnectingIp)) {
    return cfConnectingIp;
  }

  // 4. Kiểm tra X-Client-IP
  const xClientIp = getHeaderValue('x-client-ip');
  if (xClientIp && isValidIp(xClientIp)) {
    return xClientIp;
  }

  // 5. Fallback: sử dụng request.ip (cho development)
  // Express tự động parse từ connection
  const requestIp = request.ip || request.socket?.remoteAddress || 'unknown';

  // Xử lý IPv6 loopback và IPv4-mapped IPv6
  if (requestIp === '::1' || requestIp === '::ffff:127.0.0.1') {
    return '127.0.0.1';
  }

  // Loại bỏ prefix IPv6 nếu có
  if (requestIp.startsWith('::ffff:')) {
    return requestIp.substring(7);
  }

  return requestIp;
});

/**
 * Validate IP address (IPv4 hoặc IPv6)
 */
function isValidIp(ip: string): boolean {
  if (!ip || ip === 'unknown') {
    return false;
  }

  // Regex cho IPv4
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;

  // Regex cho IPv6 (simplified)
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
