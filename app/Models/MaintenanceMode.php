<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceMode extends Model
{
    use HasFactory;

    protected $table = 'maintenance_mode';

    protected $fillable = ['activity', 'status'];

    public $timestamps = false;

    /**
     * Check if maintenance mode is enabled
     *
     * @return bool
     */
    public static function isEnabled(): bool
    {
        $record = self::first();
        return $record && $record->status == 1;
    }

    /**
     * Toggle maintenance mode
     *
     * @return bool
     */
    public static function toggle(): bool
    {
        $record = self::first();
        
        if (!$record) {
            $record = self::create([
                'activity' => 'System Maintenance',
                'status' => 1
            ]);
            return true;
        }

        $record->status = $record->status == 1 ? 0 : 1;
        $record->save();
        
        return $record->status == 1;
    }

    /**
     * Get current maintenance mode status
     *
     * @return array
     */
    public static function getStatus(): array
    {
        $record = self::first();
        
        return [
            'enabled' => $record && $record->status == 1,
            'activity' => $record ? $record->activity : 'System Maintenance'
        ];
    }
}
