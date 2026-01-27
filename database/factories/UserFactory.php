<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => bcrypt('password'), // default password: password
            'remember_token' => Str::random(10),
            'firstname' => fake()->firstName(),
            'middlename' => fake()->optional()->firstName(),
            'lastname' => fake()->lastName(),
            'username' => fake()->unique()->userName(),
            'avatar' => fake()->optional()->imageUrl(),
            'activation_key' => Str::random(32),
            'expiration_date' => fake()->optional()->date(),
            'last_login' => fake()->optional()->unixTime(),
            'type' => fake()->numberBetween(0, 2),
            'status' => fake()->numberBetween(0, 1),
            'permissions' => fake()->numberBetween(0, 2),
            'credit' => fake()->optional()->numberBetween(0, 1000),
            'date_added' => now(),
            'date_updated' => fake()->optional()->dateTime(),
            'credit_date' => fake()->optional()->dateTime(),
            'credit_voucher_used' => fake()->optional()->uuid(),
            'last_credit_update' => fake()->optional()->date(),
            'office_id' => fake()->numberBetween(1, 10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
